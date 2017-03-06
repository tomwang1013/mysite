<template>
<div class='popuplist u-relative'
  @keydown.up.prevent='scrollUpItems'
  @keydown.down.prevent='scrollDownItems'
  @keydown.enter.prevent='selectItem($event, hIndex)'> 

  <input type='text' :name='fieldName' :id='fieldName'
    v-bind:class="fieldClass.join(' ')"
    v-on:focus='onInputFocus'
    :data-ori-value='oriValue'
    v-model='value' readonly/>

  <div class="o-pl u-small-font" v-show='isPopup'>
    <div class="o-pl__search" v-if="hasSearchBar">
      <input type="text" ref='searchBar' v-model="keyword" @input='searchItems'/>
    </div>

    <ul class="o-pl__items u-nav-list" v-show='items.length > 0' v-bind:style="{ height: itemsListHeight + 'px' }">
      <li v-for="(item, idx) in items" class='o-pl__item'
          v-on:click="selectItem($event, idx)"
          v-bind:class="{ 'is-active': idx == hIndex }">
        {{ item }}
      </li>
    </ul>
    <div v-show='items.length == 0'>
      没有符合条件的选项
    </div>
  </div>
</div>
</template>

<script>
  var $ = require('jquery');

  module.exports = {
    data: function() {
      return {
        value: this.oriFieldVal,
        oriValue: this.oriFieldVal,
        keyword: '', // search keyword
        items: this.initItems, // displayed items after search
        allItems: this.initItems,
        hIndex: 0, // highlight index of items
        showStartIdx: 0, // starting index of items to display
        isPopup: false,
      }
    },

    computed: {
      showEndIdx: function() {
        return this.showStartIdx + Math.min(this.items.length, this.minScrollItemCnt);
      },

      hasSearchBar: function() {
        return this.allItems.length > this.minScrollItemCnt
      },

      itemsListHeight: function() {
        return Math.min(this.items.length, this.minScrollItemCnt) * 22;
      }
    },

    props: {
      fieldName: {
        type: String,
        required: true
      },

      // original input value
      oriFieldVal: {
        type: String,
        default: ''
      },

      fieldClass: {
        type: Array,
        default: function() { return []; },
      },

      /*
       * initial items in the popup list
       * if isListFixed is true, we must provide items at initialization
       * or provide itemsInitUrl to pre-fetch it
       */
      initItems: {
        type:    Array,
        default: function() { return []; },
      },

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
      onInputFocus: function(evt) {
        this.isPopup = true;

        if (this.hasSearchBar) {
          this.$nextTick(function() {
            this.$refs.searchBar.focus();
          });
        }
      },

      searchItems: function() {
        var me = this;

        this.items = this.allItems.filter(function(item) {
          return item.indexOf(me.keyword) != -1; 
        });

        this.hIndex = 0;
        this.showStartIdx = 0;  // reset show range
      },

      scrollDownItems: function() {
        if (!this.isPopup || this.hIndex >= this.items.length - 1) {
          return;
        }

        this.hIndex++;

        if (this.hIndex > this.showEndIdx) {
          this.showStartIdx++;
          this.showEndIdx++;
        }
      },

      scrollUpItems: function() {
        if (!this.isPopup || this.hIndex <= 0) {
          return;
        }

        this.hIndex--;

        if (this.hIndex < this.showStartIdx) {
          this.showStartIdx--;
          this.showEndIdx--;
        }
      },

      selectItem: function(evt, idx) {
        if (0 <= idx && idx < this.items.length) {
          this.value = this.items[idx];
          this.reset();
        }
      },

      reset: function() {
        this.keyword = '';
        this.items = this.allItems;
        this.hIndex = 0;
        this.showStartIdx = 0;
        this.isPopup = false;
      }
    },

    mounted: function() {
      if (!this.initItems.length) {
        var me = this;

        if (this.itemsInitUrl) {
          $.get(this.itemsInitUrl, function(data) {
            me.allItems = data.items;
            me.items = data.items;
          });
        } else {
          // error
        }
      }
    }
  };
</script>

<style lang="sass" src='partials/modules/_popup_list.scss'></style>
