<template>
<div class="popuplist-container u-small-font">
  <div class="popuplist-searchbar" v-if="items.length > minScrollItemCnt">
    <input type="text" v-model="keyword" @input='searchItems'
      @keydown.up='scrollUpItems' @keydown.down='scrollDownItems' @keydown.enter='selectItem'>
  </div>
  <div class="popuplist-items">
    <ul class="u-nav-list">
      <li v-for="(item, idx) in items" class="{ 'popuplist-item-active': idx == hIndex }">{{ item }}</li>
    </ul>
  </div>
</div>
</template>

<script>
  module.exports = {
    data: function() {
      return {
        keyword: '', // search keyword
        items: this.initItems, // displayed items after search
        hIndex: 0, // highlight index of items
        showStartIdx: 0, // starting index of items to display
      }
    },

    computed: {
      showEndIdx: function() {
        return this.showStartIdx + Math.min(this.items.length, minScrollItemCnt);
      }
    },

    props: {
      /*
       * initial items in the popup list
       * if isListFixed is true, we must provide items at initialization
       * or provide itemsInitUrl to pre-fetch it
       */
      initItems: {
        type:    Array,
        default: [],
      }

      /*
       * if isListFixed is ture && items is empty, we use this url to
       * pre-fetch items
       * only used if initItems is empty
       */
      itemsInitUrl: {
        type:    String,
        default: ''
      },

      /*
       * min items count to show search bar
       */
      minScrollItemCnt: {
        type:    Number,
        default: 10
      }
    },

    methods: {
      searchItems: function() {
      },

      scrollDownItems: function() {
      },

      scrollUpItems: function() {
      },

      selectItem: function() {
      }
    },

    mounted: function() {
      if (!this.initItems.length) {
        if (this.itemsInitUrl) {
        } else {
          // error
        }
      }
    }
  };
</script>

<style lang="sass" src='partials/modules/_popup_list.scss'></style>
