<template lang='pug'>
</template>

<script>
  module.exports = {
    data: function() {
      return {
        keyword: '',  // search keyword
        displayItems: [], // displayed items after search
      }
    },

    computed: {
      // if popup list is shown
      showPupupList: function() {
        return this.displayItems.length > 0;
      }
    },

    props: {
      // if the search list is fixed i.e. pre-fetched
      isListFixed: true,

      /*
       * items in the popup list
       * if isListFixed is true, we must provide items at initialization
       * or provide itemsInitUrl to pre-fetch it
       * only used if isListFixed is true
       */
      items: [],

      /*
       * if isListFixed is ture && items is empty, we use this url to
       * pre-fetch items
       * only used if isListFixed is true
       */
      itemsInitUrl: '',

      /* 
       * search url for items when isListFixed is false
       * only used if isListFixed is false
       */
      itemsSearchUrl: ''
    },

    methods: {
    },

    mounted: function() {
    }
  };
</script>

<style lang="sass" src='partials/modules/_popup_list.scss'></style>
