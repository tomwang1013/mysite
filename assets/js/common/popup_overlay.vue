<template>
  <div class='o-overlay-bk' v-show='isShow'>
    <div class='o-overlay-dlg' ref='dlg' v-bind:style='dlgPos'>
      <div class='o-overlay-dlg__head' v-if='$slots.head'>
        <slot name='head'></slot>
      </div>
      <div class='o-overlay-dlg__body'>
        <slot name='body'></slot>
      </div>
      <div class='o-overlay-dlg__foot'>
        <slot name='foot'>
          <input class='u-fir-span o-btn o-btn-primary' type='button' @click='onOk' :value='okText'/>
          <input class='ol-cancel o-btn o-btn-normal' type='button' @click='onCancel' :value='cancelText'/>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
  var $ = require('jquery');

  module.exports = {
    name: 'popup-overlay',

    data: function() {
      return {
        isShow: false,
        dlgPos: { top: 0, left: 0 }
      };
    },

    props: {
      okText: {
        type: String,
        default: '确定'
      },

      cancelText: {
        type: String,
        default: '取消'
      }
    },

    methods: {
      onOk: function(evt) {
        this.isShow = false;
        this.$emit('ok');
      },

      onCancel: function(evt) {
        this.isShow = false;
        this.$emit('cancel');
      }
    },

    watch: {
      isShow: function(nv) {
        if (!nv) return;

        this.$nextTick(function() {
          var vw        = window.innerWidth;
          var vh        = window.innerHeight;
          var dlgRect   = this.$refs.dlg.getBoundingClientRect();

          this.dlgPos = {
            top:  (vh - dlgRect.height) / 2 + 'px',
            left: (vw - dlgRect.width) / 2 + 'px'
          };
        });
      }
    }
  };
</script>

<style lang="sass" src='partials/modules/_popup_overlay.scss'></style>
