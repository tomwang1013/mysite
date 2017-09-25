<template lang='pug'>
div
  .c-uc-jobs(v-if='userType == 0')
    .c-uc-jobs-type.small-font
      a.c-uc-jobs-type__link(
        v-for='(tab, s) in stdJobTabs'
        v-bind:href="'/profile/jobs?status=' + s"
        v-bind:class="{'is-active': status == s}") {{tab}}

    .u-center-text(v-if='appliedJobs.length == 0') {{stdNoJobHints[status]}}
    .c-uc-job(v-else v-for='appliedJob in appliedJobs')
      .c-uc-job__title
        a(v-bind:href="'/job/' + appliedJob._job._id") {{appliedJob._job.title}}

      .c-uc-job__basics.u-small-font
        span 发布日期：<strong>{{appliedJob._job.createdAt.toLocalTime()}}</strong>
        span 申请日期：<strong>{{appliedJob.createdAt.toLocalTime()}}</strong>
        span 公司：    <strong>{{appliedJob._job._creator.name}}</strong>
        span 工作地点：<strong>{{appliedJob._job.address}}</strong>
        span 申请人数：<strong>{{appliedJob._job.appliers_cnt}}</strong>

      .c-uc-job__status.u-small-font
        .u-unknown-result(v-if='appliedJob.status == 0') 您的申请正在审核中，请耐心等待
        .u-error-result(v-if='appliedJob.status == 1') {{appliedJob.message}}
        .u-success-result(v-if='appliedJob.status == 2') {{appliedJob.message}}

  .c-uc-jobs(v-else)
    div(style={'margin-bottom': '0.5em'})
      a(href='/jobs/new' class='o-btn o-btn-primary') 发布新的职位
    .c-uc-job(v-for='job in createdJobs')
      .c-uc-job__title
        a.u-flex-mg-r-auto(v-bind:href="'/job/' + job._id") {{job.title}}
        span.u-fir-span 申请人数：
          a(v-if='job.appliers_cnt > 0' v-bind:href="'/job/' + job._id + '/appliers'") {{job.appliers_cnt}}
          a(v-else href='#') 0
        a.u-fir-span(v-bind:href="'/job/' + job._id + '/edit'") 编辑
        a(v-bind:href="'/job/' + job._id + '/questions'") 题目列表

      .c-uc-job__basics.u-small-font
        span 发布日期：<strong>{{job.createdAt.toLocalTime()}}</strong>
        span 工作地点：<strong>{{job.address}}</strong>
</template>

<script>
  let $ = require('jquery');

  export default {
    data: function() {
      return {
        appliedJobs: [],
        createdJobs: [],
        stdNoJobHints: {
          all:       '你还没有申请任何职位！',
          replied:   '你还没有任何申请回复！',
          unreplied: '你还没有任何未回复的申请！'
        },
        stdJobTabs: {
          all:       '全部职位',
          replied:   '已经回复的职位',
          unreplied: '还未回复的职位'
        },
        status: window.location.search ? window.location.search.slice(8) : 'all'
      };
    },

    props: {
      userType: {
        type: Number,
        required: true
      },
    },

    created: function() {
      let me = this;
      let dataUrl;

      if (this.userType === 0) {
        dataUrl = '//api.51shixi.net/nc/applied_jobs';
      } else {
        dataUrl = '//api.51shixi.net/nc/created_jobs';
      }

      $.ajax(dataUrl, {
        data: {
          status: this.status
        },
        xhrFields: {
          withCredentials: true
        }
      }).done(function(data) {
        if (me.userType === 0) {
          me.appliedJobs = data;
        } else {
          me.createdJobs = data;
        }
      }).fail(function(err) {
        // TODO
      });
    }
  };
</script>

<style lang="scss" src='profile/jobs.scss'></style>
