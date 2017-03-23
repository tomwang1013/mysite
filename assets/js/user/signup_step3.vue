<template lang='pug'>
  .c-signup-step-over.u-success-result 注册完成！马上去：
    a(href='/jobs' v-if='userType == 0') 找寻实习岗位
    a(href='/jobs/new' v-else) 发布实习岗位
</template>

<script>
  module.exports = {
    name: 'signup-step3',
    props: {
      userType: {
        type: Number,
        default: 0
      }
    }
  };
</script>
