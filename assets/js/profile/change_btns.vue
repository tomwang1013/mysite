<template lang='pug'>
  .c-change-btns(v-show='isShow')
    button.u-fir-span(type='button', class='o-btn o-btn-primary' @click="$emit('save', relFieldName)") 修改
    button(type='button', class='o-btn o-btn-normal' @click="$emit('cancel', relFieldName)") 取消
</template>

<script>
  export default {
    name: 'profile-change-buttons',

    props: {
      isShow: {
        type: Boolean,
        required: true
      },

      relFieldName: {
        type: String,
        required: true
      }
    }
  };
</script>

<style lang="scss">
  .c-change-btns {
    margin-top: 0.5em;
  }
</style>
