<template>
  <div class="tab-container u-small-font">
    <div class="tab-header">
      <ul class="u-nav-list">
        <li v-for="label in labels" class="{ 'tab-label-active': activeLabel == label } ">{{ label }}</li>
        <a href="javascript:void(0)" class="tab-clear">清空</a>
      </ul>
    </div>
    <div class="tab-content">
      <ul class="u-nav-list">
        <li v-for="item in items" class="{ 'tab-item-active': activeItem == item }">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  var $ = require('jquery');

  module.exports = {
    name: 'popup-tabs',

    data: function() {
      return {
        labels:         this.initLables.slice(0, 1),
        items:          Object.keys(this.initItems),
        activeLabel:    this.initLables[0],
        activeItem:     '',
        selectedItems:  []
      };
    },

    props: {
      initLables: {
        type: Array,
        required: true,
        default: function() {
          return [];
        }
      },

      initItems: {
        type: Array,
        required: true,
        default: function() {
          return {};
        }
      }
    }
  };
</script>

<style lang="sass" src='partials/modules/_popup_tabs.scss'></style>
