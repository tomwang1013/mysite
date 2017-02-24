<template>
  <div id='labels-wrapper' class='u-relative'>
    <!-- original form input -->
    <input type='hidden' :name='inputId' :id='inputId' :value="currentLabels.join(',')" class='o-fm-ctl'></input>

    <!-- current labels -->
    <span class="o-labels-input" :class="{'is-active': isActive}">
      <template v-for="label in currentLabels">
        <span class="o-labels-input__lab-wrapper">
          <span>{{ label }}</span>
          <span class="fa fa-times o-labels-input__lab-del" aria-hidden="true" :label="label" :data-label="label" @click="removeFromCurLabels"></span>
        </span>
      </template>
      <input class="o-labels-input__input" ref="labInput" @focus="focusInput" @blur="blurInput" @input="searchLabels" @keydown.enter.prevent="addLabel" v-model.trim="inputLabel"></input>
    </span>

    <!-- popup matching labels -->
    <div class="o-labels-popup u-small-font" v-show="showPopup">
      <span class="fa fa-times o-labels-popup__close" @click="showPopup = false"></span>
      <ul class="u-nav-list">
        <template v-for="label in matchingLabels">
          <li class="o-labels-popup__item" :data-label="label.name" @click="addToCurLabels">
            <span>{{ label.name }}</span>
            <span>{{ label.ques_cnt }}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
  var $ = require('jquery');
  var _ = require('lodash');

  module.exports = {
    data: function() {
      return {
        currentLabels: this.initLabels,
        matchingLabels: [],
        isActive: false,
        showPopup: false,
        inputLabel: ''
      }
    },

    props: {
      inputId:    { required: true },
      searchUrl:  { required: true },
      addUrl:     { required: true },
      initLabels: {
        type: Array,
        default: function () { return [] }
      }
    },

    methods: {
      focusInput: function(evt) {
        this.isActive = true;
      },

      blurInput: function(evt) {
        this.inputLabel = '';
        this.isActive = false;
      },

      // instantly search matching labels when input label prefix
      searchLabels: function(evt) {
        if (!this.inputLabel) {
          this.showPopup = false;
          return;
        }

        var me = this;

        $.get(this.searchUrl, { name: me.inputLabel }, function(data) {
          if (data.error || !data.labels.length) {
            me.showPopup = false;
          } else {
            me.matchingLabels = data.labels;
            me.showPopup = true;
          }
        });
      },

      // add new label to remote server
      addLabel: function(evt) {
        var me = this;

        $.post(this.addUrl, { name: me.inputLabel }, function(data) {
          me.currentLabels.push(me.inputLabel);
          me.inputLabel = '';
        });
      },

      // remove a currently selected label
      removeFromCurLabels: function(evt) {
        var labelToRem = evt.target.dataset.label;
        this.currentLabels.splice(this.currentLabels.indexOf(labelToRem), 1);
        this.inputLabel = '';
        this.$refs.labInput.focus();
      },

      // add to current labels
      addToCurLabels: function(evt) {
        this.currentLabels.push(evt.currentTarget.dataset.label);
        this.inputLabel = '';
        this.$refs.labInput.focus();
      }
    }
  };
</script>

<style lang="sass" src='partials/modules/_input_labels.scss'></style>
