<template>
<div class='o-pt-root' v-bind:style='rootStyle'>
  <input type='text' :name='fieldName' :id='fieldName' ref='input' v-bind:style='inputStyle'
    :value='value' v-bind:class='fieldClass' @focus='isPopup = true' readonly/>
  <div class="o-pt-tabs u-small-font" v-show='isPopup'>
    <ul class="o-pt-tabs__lables u-nav-list">
      <li @click='switchTab($event, label)' v-for="label in labels"
        class='o-pt-tabs__lable'
        v-bind:class="{ 'is-active': activeLabel == label } ">
        {{ label }}
      </li>
      <a href="javascript:void(0)" class="o-pt-tabs__clear" @click="reset">清空</a>
    </ul>
    <ul class="o-pt-tabs__items u-nav-list">
      <li @click='pickItem($event, item)' v-for="item in items"
        class='o-pt-tabs__item'
        v-bind:class="{ 'is-active': activeItem == item }">
        {{ item }}
      </li>
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
        activeItem:     this.initItem,
        selectedItems:  [],
        isPopup:        false,
        value:          ''
      };
    },

    watch: {
      isPopup: function(nv) {
        if (!nv) return;

        var me = this;

        $('html').on('click.pt', function(e) {
          if (!$(e.target).closest('.o-pt-root').length) {
            me.isPopup = false;
            $('html').off('click.pt');
          }
        });
      }
    },

    props: {
      rootStyle: {
        type: Object,
        default: function() {
          return {
            position: 'relative',
            flex: 1
          }
        }
      },

      inputStyle: {
        type: Object,
        default: function() {
          return { width: '100%' };
        }
      },

      fieldName: {
        type: String,
        required: true
      },

      fieldClass: {
        type: String,
        default: ''
      },

      initItem: {
        type: String,
        default: ''
      },

      initLables: {
        type: Array,
        required: true
      },

      initItems: {
        type: Object,
        required: true
      }
    },

    methods: {
      reset: function() {
        this.value='';
      },

      switchTab: function(evt, label) {
        if (label == this.activeLabel) return;

        var level = this.labels.indexOf(label);

        this.activeLabel = label;
        this.items       = this.getItemsByLevel(level - 1);
        this.activeItem  = this.selectedItems[level];
      },

      pickItem: function(evt, item) {
        var level = this.labels.indexOf(this.activeLabel);

        this.selectedItems[level] = item;
        this.activeItem = item;

        // click in the last tab's items, select it
        if (level == this.initLables.length - 1) {
          this.value = item;
          this.isPopup = false;
          return;
        }

        var nextLevelItems = this.getItemsByLevel(level);

        if (!nextLevelItems) {
          this.isPopup = false;
          this.value = item;
          return;
        }

        this.items = nextLevelItems;

        if (!this.labels[level + 1]) {
          this.labels[level + 1] = this.initLables[level + 1];
        }

        this.activeLabel = this.labels[level + 1];
      },

      getItemsByLevel: function(level) {
        var curData = this.initItems;

        for (var i = 0; i <= level; i++) {
          curData = curData[this.selectedItems[i]];
        }

        if (curData instanceof Array) {
          return curData;
        } else if (typeof(curData) === 'object') {
          return Object.keys(curData);
        } else {
          return null;
        }
      }
    },

    created: function() {
      var initItem = this.initItem;
      var path = [];
      var siblings = [];

      function findIt(root) {
        var finded = false;
        var keys = Object.keys(root);

        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          var v = root[k];

          if (typeof(v) === 'string') {
            if (v === initItem) {
              path.push(initItem);
              siblings = keys;
              finded = true;
              break;
            }
          } else if (v instanceof Array) {
            if (v.indexOf(initItem) != -1) {
              path.push(k, initItem);
              siblings = v;
              finded = true;
              break;
            }
          } else {
            path.push(k);
            finded = findIt(v);

            if (finded) break;
            else path.pop();
          }
        };

        return finded;
      }

      if (initItem != '' && findIt(this.initItems)) {
        this.labels          = this.initLables.slice(0, path.length);
        this.items           = siblings;
        this.activeLabel     = this.labels[path.length - 1];
        this.selectedItems   = path;
      }
    }
  };
</script>

<style lang="sass" src='partials/modules/_popup_tabs.scss'></style>
