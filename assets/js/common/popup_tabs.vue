<template>
<div class='popup-tabs-comp'>
  <input type='text' name='fieldName' id='fieldName' ref='input' :value='value' class='fieldClass' @focus='isPopup = true' readonly/>
  <div class="tab-container u-small-font" v-show='isPopup'>
    <div class="tab-header">
      <ul class="u-nav-list">
        <li @click='switchTab($event, label)' v-for="label in labels" class="{ 'tab-label-active': activeLabel == label } ">{{ label }}</li>
        <a href="javascript:void(0)" class="tab-clear" @click="reset">清空</a>
      </ul>
    </div>
    <div class="tab-content">
      <ul class="u-nav-list">
        <li @click='pickItem($event, item)' v-for="item in items" class="{ 'tab-item-active': activeItem == item }">{{ item }}</li>
      </ul>
    </div>
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

    computed: {
    },

    watch: {
      isPopup: function(nv) {
        if (!nv) return;

        var me = this;

        $('html').bind('click.tab', function(e) {
          if (!$(e.target).closest('.tab-container').length && 
              !$(e.target).closest(me.$refs.input).length) {
                me.isPopup = false;
              }
        });
      }
    },

    props: {
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
        type: Array,
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
        this.items       = getItemsByLevel(level - 1);
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

        var nextLevelItems = getItemsByLevel(level);

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
