<template>
  <div class='o-overlay-wrapper' v-show='isShow'>
    <div class='o-overlay-bk'></div>
    <div class='o-overlay-dlg'>
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
  module.exports = {
    data: function() {
      return {
        isShow: false
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

    computed: {
    },

    methods: {
      onOk: function(evt) {
        this.$emit('onok');
      },

      onCancel: function(evt) {
        this.isShow = false;
        this.$emit('oncancel');
      }
    }
  };
</script>

<style lang="sass" src='partials/modules/_popup_overlay.scss'></style>
