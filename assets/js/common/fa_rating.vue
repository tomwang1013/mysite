<template>
  <div class='o-rat-root'>
    <input type='text' v-bind:name='fieldName'
      v-bind:id='fieldName' v-bind:value='curSelectedValue'/>
    <div class='o-rat-widget'>
      <a v-for='(v, idx) in allValues'
        v-on:click='onClick'
        v-on:mouseenter='onMouseEner'
        v-on:mouseleave='onMouseLeave'
        v-bind:class="{ 'is-selected': idx <= curSelectedIdx, 'cur-selected': idx === curSelectedIdx}"/>
    </div>
  </div>
</template>

<script>
  var _ = require('lodash');

  module.exports = {
    name: 'fa-rating',

    props: {
      fieldName: {
        type: String,
        required: true
      },

      initialValue: {
        type: String,
        validator: function(v) {
          return _.includes(this.allValues, v);
        }
      },

      allValues: {
        type: Array,
        required: true
      },

      readOnly: {
        type: Boolean,
        default: false
      },

      allowEmpty: {
        type: Boolean,
        default: false
      },

      emptyValue: {
        type: String,
        default: ''
      }
    },

    data: function() {
      return {
        curSelectedIdx: this.allValues.indexOf(this.initialValue),
      }
    },

    computed: {
      curSelectedValue: function() {
        if (this.curSelectedIdx != -1) {
          return this.allValues[this.curSelectedIdx];
        else if (this.allowEmpty) {
          return this.emptyValue;
        } else {
          return '';
        }
      }
    },

    methods: {
      onClick: function(evt) {
        if (this.readOnly) return;
      },

      onMouseEner: function(evt) {
        if (this.readOnly) return;
      },

      onMouseLeave: function(evt) {
        if (this.readOnly) return;
      }
    }
  };
</script>

<style lang="sass" src='partials/modules/_input_labels.scss'></style>
