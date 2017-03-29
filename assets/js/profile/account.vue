<template lang='pug'>
div
  //- 头像上传
  .c-uc-chg-head 修改头像
  .c-uc-acc-chg
    div(style={'margin-bottom': '1em'})
      div(style={'margin-bottom': '1em'}) 头像：
      img(class='u-round-border' width=70 height=70 :src='user.avatarUrl')
      span(class='c-uc-acc-chg__upload-ava o-btn o-btn-normal')
        label(for='avatar') {{uploadAvatarText}}
        input(type='file' id='avatar' name='avatar' @change='uploadAvatar' :disabled='uploadAvatarDisabled')

    //- 头像裁减框
    popup-overlay(v-on:ok='onOk' ref='po')
      span(slot='head') 裁剪并替换新的头像
      .c-ava-crop-area(slot='body'
                      v-bind:style='cropAreaCss'
                      @dragstart.stop.prevent='return false'
                      @mousemove='onMove'
                      @mouseup='onLeave'
                      @mouseleave='onLeave')
        img.c-ava-crop-area__ori-img(:src='originImgPath')
        .c-ava-crop-area__ret-img(v-bind:style='cropArea')
          img(:src='originImgPath' v-bind:style="{'margin-left': -cropArea.left, 'margin-top': -cropArea.top}")
        div(v-for='part in cropAreaParts'
          v-bind:class="'c-ava-crop-area__' + part.name"
          v-bind:style='part.css'
          @mousedown='onDown'
          :name='part.name')

  //- 账号修改
  .c-uc-chg-head 修改账号信息
  form(method='post' action='/profile/change_account' class='c-uc-acc-chg js-account-edit')
    .o-fm-grp
      label(for='name') 用户名：
      input(type='text', name='name', id='name', class='o-fm-ctl', value=user.name)

    .o-fm-grp
      label(for='email') Email：
      input(type='email', name='email', id='email', class='o-fm-ctl', value=user.email)

    .o-fm-grp
      label(for='phone') 电话：
      input(type='text', name='phone', id='phone', class='o-fm-ctl', value=user.phone)

    .o-fm-grp
      input(type='submit', value='更新账号信息' class='o-btn o-btn-primary u-fir-span')
      span.u-bold-text.u-success-result.js-result-hint(style={display: 'none'})

  //- 修改密码
  .c-uc-chg-head 修改密码
  form(method='post' action='/profile/change_password' class='c-uc-acc-chg js-password-edit')
    .o-fm-grp
      label(for='old_pwd') 旧密码：
      input(type='password', name='old_pwd', id='old_pwd', class='o-fm-ctl')

    .o-fm-grp
      label(for='new_pwd') 新密码：
      input(type='password', name='new_pwd', id='new_pwd', class='o-fm-ctl')

    .o-fm-grp
      label(for='c_new_pwd') 确认新密码：
      input(type='password', name='c_new_pwd', id='c_new_pwd', class='o-fm-ctl')

    .o-fm-grp
      input(type='submit', value='更新密码' class='o-btn o-btn-primary u-fir-span')
      span.u-bold-text.u-success-result.js-result-hint(style={display: 'none'})
</template>

<script>
  var $ = require('jquery');
  var PO  = require('mycomps/lib/components/popup_overlay.vue');

  module.exports = {
    data: function() {
      user: {},
      originImgPath: '',
      cropArea: {},
      originSize: {},
      uploadAvatarText: '上传头像',
      uploadAvatarDisabled: false,
      cropAreaCss: {},
      cropAreaParts: [
        { name: 'move-area',   css: { cursor: 'move' },      oldCursor: 'move' },
        { name: 'left-edge',   css: { cursor: 'w-resize' },  oldCursor: 'w-resize' },
        { name: 'top-edge',    css: { cursor: 'n-resize' },  oldCursor: 'n-resize' },
        { name: 'right-edge',  css: { cursor: 'e-resize' },  oldCursor: 'e-resize' },
        { name: 'bottom-edge', css: { cursor: 's-resize' },  oldCursor: 's-resize' },
        { name: 'tl-corner',   css: { cursor: 'nw-resize' }, oldCursor: 'nw-resize' },
        { name: 'tm-corner',   css: { cursor: 'n-resize' },  oldCursor: 'n-resize' },
        { name: 'tr-corner',   css: { cursor: 'ne-resize' }, oldCursor: 'ne-resize' },
        { name: 'lm-corner',   css: { cursor: 'w-resize' },  oldCursor: 'w-resize' },
        { name: 'rm-corner',   css: { cursor: 'e-resize' },  oldCursor: 'e-resize' },
        { name: 'bl-corner',   css: { cursor: 'sw-resize' }, oldCursor: 'sw-resize' },
        { name: 'bm-corner',   css: { cursor: 's-resize' },  oldCursor: 's-resize' },
        { name: 'br-corner',   css: { cursor: 'se-resize' }, oldCursor: 'se-resize' },
      ],
      dragInfo: {
        target: null,
        oriPos: { left: 0, top: 0 }
      }
    },

    components: {
      'popup-overlay': PO
    },

    methods: {
      onOk: function() {
        var me = this;

        $.post('/profile/change_avatar2', {
          x: this.cropArea.left,
          y: this.cropArea.top,
          width: this.cropArea.width,
          height: this.cropArea.height,
          origin_img_path: this.originImgPath
        }, function(data) {
          me.user.avatarUrl = data.url + '?' + new Date().getTime();
        });
      },

      // 用户选择图片后开始上传
      uploadAvatar: function(evt) {
        var file = evt.files[0];

        if (!file) return;

        var me = this;

        this.uploadAvatarText = '上传中，请稍等...';
        this.uploadAvatarDisabled = true;

        var formData = new FormData();

        formData.append('avatar', file);

        $.ajax({
          type: 'POST',
          url: '/profile/change_avatar',
          data: formData,
          processData: false,
          contentType: false,
          success: function(data) {
            me.uploadAvatarText = '上传头像';
            me.uploadAvatarDisabled = false;

            if (!data.error) {
              me.cropImageAndSave(data.url, data.size);
            }
          }
        });
      },

      // 展示裁减悬浮框
      cropImageAndSave: function(imgToCrop, size) {
        var ow = size.width;
        var oh = size.height;

        this.originImgPath = imgToCrop;
        this.originSize = size;

        this.cropArea = { left: 0, top: 0, width: 0, height: 0 };

        if (ow <= oh) {
          this.cropArea.top = (oh - ow) / 2;
          this.cropArea.width = this.cropArea.height = ow;
        } else {
          this.cropArea.left = (ow - oh) / 2;
          this.cropArea.width = this.cropArea.height = oh;
        }

        this.cropAreaCss = { width: ow, height: oh };
        this.drawCropArea();
        this.$refs.po.isShow = true;
      },

      // 点击开始拖动
      onDown: function(evt) {
        this.dragInfo.target = evt.target;
        this.dragInfo.oriPos.left = evt.pageX;
        this.dragInfo.oriPos.top = evt.pageY;

        // 得到点击时的鼠标形状并将其应用于整个区域
        var dragPart = _.find(this.cropAreaParts, function(p) {
          return p.name == evt.target.name;
        });

        this.cropAreaCss.cursor = dragPart.css.cursor;
        _.each(cropAreaParts, function(p) {
          p.css.cursor = dragstart.css.cursor;
        });
      },

      // 拖动
      onMove: function(evt) {
        var oriPos = this.dragInfo.oriPos;

        if (this.dragInfo.target) {
          var offset = {
            dx: e.pageX - oriPos.left,
            dy: e.pageY - oriPos.top
          };

          if (offset.dx || offset.dy) {
            this.adjustCropArea(target, offset);
            oriPos.left = e.pageX;
            oriPos.top  = e.pageY;
          }
        }
      },

      // 拖动结束
      onLeave: function(evt) {
        if (this.dragInfo.target) {
          // restore the cursor
          this.cropAreaCss.cursor = 'default';

          _.each(cropAreaParts, function(p) {
            p.css.cursor = p.oldCursor;
          });

          this.dragInfo.target = null;
        }
      }
    },

    created: function() {
      var me = this;

      $.ajax('//api.51shixi.net/nc/user_info', {
        xhrFields: {
          withCredentials: true
        }
      }).done(function(data) {
        me.user = data;
      });
    }
  };
</script>

<style lang="sass" src='profile/account.scss'></style>
