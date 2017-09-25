<template lang='pug'>
ul.c-uc-left-nav.u-small-font.u-nav-list
  li(v-for='item in items')
    router-link(v-bind:to="'/profile/' + item[0]" class='c-uc-left-nav__item' active-class='is-active') {{ item[1] }}
</template>

<script>
export default {
  data: function() {
    return {
      items: [
        ['user_info', '基本信息'],
        ['jobs', this.userType === 0 ? '申请的职位' : '发布的职位'],
        ['message', '消息中心'],
        ['account', '账号与密码']
      ]
    }
  },

  props: {
    userType: {
      type: Number,
      required: true
    }
  }
};
</script>

<style lang="scss">

.c-uc-left-nav {
  flex: 1;
  border: 1px solid #ccc;
  text-align: center;
}

.c-uc-left-nav__item {
  display: block;
  line-height: 2;
  border-bottom: 1px solid #ccc;

  &.is-active {
    color: #000;
    border-left: 2px solid #a00;
    cursor: default;
  }

  &:hover:not(.is-active) {
    background-color: #ddd;
  }
}

/* 右侧具体内容(暂时放这里) */
.c-uc-right-content {
  flex: 6;
  padding: 15px 20px;
  border: 1px solid #ccc;
  border-left:none;
}
</style>
