<template lang='pug'>
div
  .c-uc-messages(v-if='messages.length > 0')
    .c-uc-message.u-small-font(v-for='message in messages')
      .c-uc-message__title
        a.js-msg-link(v-on:click.prevent='followMsg(message)' v-bind:class="{'is-read': message.read}") 你申请的职位 {{message._job.title}} 有回复了 
      .c-uc-message__operation
        a.js-set-read(v-if='!message.read' v-on:click.prevent='setRead(message)') 置为已读
        span(v-else) 已读
  .no-msg.text-center(v-else) 暂时没有任何消息！
</template>

<script>
  var $ = require('jquery');

  module.exports = {
    data: function() {
      return {
        messages: []
      }
    },

    props: {
      userType: {
        type: Number,
        required: true
      },
    },

    methods: {
      followMsg: function(message) {
        if (message.read) {
          return;
        }

        $.post('/profile/message/set_read', { msg_id: message.id }, function() {
          window.location = '/profile/jobs?status=replied';
        }, 'json');
      },

      setRead: function(message) {
        $.post('/profile/message/set_read', { msg_id: message.id }, function() {
          message.read = true;
        }, 'json');
      }
    },

    created: function() {
      var me = this;

      $.ajax('//api.51shixi.net/nc/messages', {
        xhrFields: {
          withCredentials: true
        }
      }).done(function(data) {
        me.messages = data;
      }).fail(function(err) {
        // TODO
      });
    }
  };
</script>

<style lang="sass" src='profile/message.scss'></style>
