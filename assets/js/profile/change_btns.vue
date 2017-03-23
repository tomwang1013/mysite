<template lang='pug'>
  .c-change-btns(v-show='isShow')
    button.u-fir-span(type='button', class='o-btn o-btn-primary' @click="$emit('save', relFielName)") 修改
    button(type='button', class='o-btn o-btn-normal' @click="$emit('cancel', relFielName)") 取消
</template>

<script>
  module.exports = {
    name: 'profile-change-buttons',

    props: {
      isShow: {
        type: Boolean,
        default: false
      },

      relFieldName: {
        type: String,
        required: true
      }
    }
  };
</script>

<style lang="sass">
  .c-change-btns {
    margin-top: 0.5em;
  }
</style>
