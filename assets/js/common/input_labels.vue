<template>
  <div>
    <!-- original form input -->
    <input type='hidden' :name='inputId' :id='inputId' class='o-fm-ctl'></input>

    <!-- current labels -->
    <span class="il-labels-input u-round-border" :class="{'is-active': isActive}">
      <span class="il-labels">
        <template v-for="label in currentLabels">
          <span class="il-in-lab u-round-border">
            <span class="il-lab-name">{{ label }}</span>
            <span class="fa fa-times il-rm-lab u-absolute" aria-hidden="true" :label="label" @click="removeFromCurLabels"></span>
          </span>
        </template>
      </span>
      <input class="il-input" @focus="isActive = true" @blur="isActive = false" @input="searchLabels" @keyup.enter="addLabel" v-model="inputLabel"></input>
    </span>

    <!-- popup matching labels -->
    <div class="il-pop-labels u-small-font" v-show="isPopuped">
      <ul class="u-nav-list">
        <template v-for="label in matchingLabels">
          <li class="il-pop-lab u-round-border" @click="addToCurLabels">
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

  module.exports = {
    data: function() {
      return {
        currentLabels: this.initLabels,
        matchingLabels: [],
        isPopuped: false,
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
      // instantly search matching labels when input label prefix
      searchLabels: function(evt) {
      },

      // add new label to remote server
      addLabel: function(evt) {
      },

      // remove a currently selected label
      removeFromCurLabels: function(evt) {
      },

      // add to current labels
      addToCurLabels: function(evt) {
      }
    }
  };
</script>

<style src='partials/modules/_input_labels.scss'></style>
