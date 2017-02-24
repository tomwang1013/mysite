<template>
  <div>
    <!-- original form input -->
    <input type='hidden' :name='inputId' :id='inputId' :value="currentLabels.join(',')" class='o-fm-ctl'></input>

    <!-- current labels -->
    <span class="il-labels-input u-round-border" :class="{'is-active': isActive}">
      <span class="il-labels">
        <template v-for="label in currentLabels">
          <span class="il-in-lab u-round-border">
            <span class="il-lab-name">{{ label }}</span>
            <span class="fa fa-times il-rm-lab u-absolute" aria-hidden="true" :label="label" :data-label="label" @click="removeFromCurLabels"></span>
          </span>
        </template>
      </span>
      <input class="il-input" @focus="focusInput" @blur="blurInput" @input="searchLabels" @keyup.enter="addLabel" v-model="inputLabel"></input>
    </span>

    <!-- popup matching labels -->
    <div class="il-pop-labels u-small-font" v-show="matchingLabels.length > 0">
      <ul class="u-nav-list">
        <template v-for="label in matchingLabels">
          <li class="il-pop-lab u-round-border" :data-label="label" @click="addToCurLabels">
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
        inputLabel: ''
      }
    },

    props: {
      inputId:    { required: true },
      searchUrl:  { required: true },
      addUrl:     { required: true },
      initLabels: {
        type: Array,
        default: []
      }
    },

    methods: {
      focusInput: function(evt) {
        this.isActive = true;
      },

      blurInput: function(evt) {
        this.isActive = false;
        matchingLabels = [];
      },

      // instantly search matching labels when input label prefix
      searchLabels: function(evt) {
        var me = this;

        $.get(this.searchUrl, { name: inputLabel }, function(data) {
          if (data.error || !data.labels.length) {
            me.matchingLabels = [];
          } else {
            me.matchingLabels = data.labels;
          }
        });
      },

      // add new label to remote server
      addLabel: function(evt) {
        var me = this;

        $.post(this.addUrl, { name: inputLabel }, function(data) {
          me.currentLabels.push(inputLabel);
          me.inputLabel = '';
          me.matchingLabels = [];
        });
      },

      // remove a currently selected label
      removeFromCurLabels: function(evt) {
        var labelToRem = evt.target.dataset.label;

        this.currentLabels.splice(this.currentLabels.indexOf(labelToRem), 1);
      },

      // add to current labels
      addToCurLabels: function(evt) {
        this.currentLabels.push(evt.target.dataset.label);
      }
    }
  };
</script>

<style lang="sass" src='partials/modules/_input_labels.scss'></style>
