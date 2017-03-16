<template>
  <div class='o-rat-root'>
    <input type='text' v-bind:name='fieldName' v-bind:id='fieldName' v-bind:value='curSelectedValue'/>
    <div class='o-rat-widget'>
      <a class='o-rat-item' 
        v-for='(v, idx) in allValues'
        v-bind:data-idx='idx'
        v-on:click.prevent='onClick'
        v-on:mouseenter='onMouseEner'
        v-on:mouseleave='onMouseLeave'
        v-bind:class="{ 'is-selected': idx <= hoverIdx, 'is-readonly': readOnly }"/>
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
      let idx = this.allValues.indexOf(this.initialValue);

      return {
        curSelectedIdx: idx,
        hoverIdx: idx 
      }
    },

    computed: {
      curSelectedValue: function() {
        if (this.curSelectedIdx != -1) {
          return this.allValues[this.curSelectedIdx];
        } else if (this.allowEmpty) {
          return this.emptyValue;
        } else {
          return '';
        }
      }
    },

    methods: {
      onClick: function(evt) {
        if (this.readOnly) return;

        this.curSelectedIdx = this.hoverIdx = evt.target.dataset.idx;
      },

      onMouseEner: function(evt) {
        if (this.readOnly) return;

        this.hoverIdx = evt.target.dataset.idx;
      },

      onMouseLeave: function(evt) {
        if (this.readOnly) return;

        this.hoverIdx = this.curSelectedIdx;
      }
    }
  };
</script>

<style lang="sass" src='partials/modules/_fa-rating.scss'></style>
