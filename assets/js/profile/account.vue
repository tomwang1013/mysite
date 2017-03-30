<template lang='pug'>
div
  //- 头像上传
  .c-uc-chg-head 修改头像
  .c-uc-acc-chg
    div(style={'margin-bottom': '1em'})
      div(style={'margin-bottom': '1em'}) 头像：
      img(class='u-round-border' width=70 height=70 v-bind:src='user.avatarUrl')
      span(class='c-uc-acc-chg__upload-ava o-btn o-btn-normal')
        label(for='avatar') {{uploadAvatarText}}
        input(type='file' id='avatar' name='avatar' @change='uploadAvatar' v-bind:disabled='uploadAvatarDisabled')

    //- 头像裁减框
    popup-overlay(v-on:ok='onOk' ref='po')
      span(slot='head') 裁剪并替换新的头像
      .c-ava-crop-area(slot='body'
                      v-bind:style='pxPrefix(cropAreaCss)'
                      @dragstart.stop.prevent=''
                      @mousemove='onMove'
                      @mouseup='onLeave'
                      @mouseleave='onLeave')
        img.c-ava-crop-area__ori-img(v-bind:src='originImgPath')
        .c-ava-crop-area__ret-img(v-bind:style='pxPrefix(cropArea)')
          img(v-bind:src='originImgPath' v-bind:style="{'margin-left': -cropArea.left + 'px', 'margin-top': -cropArea.top + 'px'}")
        div(v-for='(part, name) in cropAreaParts'
          v-bind:class="'c-ava-crop-area__' + name"
          v-bind:style='pxPrefix(part.css)'
          @mousedown='onDown'
          v-bind:name='name')

  //- 账号修改
  .c-uc-chg-head 修改账号信息
  form(method='post' action='/profile/change_account' class='c-uc-acc-chg js-account-edit')
    .o-fm-grp
      label(for='name') 用户名：
      input(type='text', name='name', id='name', class='o-fm-ctl', :value='user.name')

    .o-fm-grp
      label(for='email') Email：
      input(type='email', name='email', id='email', class='o-fm-ctl', :value='user.email')

    .o-fm-grp
      label(for='phone') 电话：
      input(type='text', name='phone', id='phone', class='o-fm-ctl', :value='user.phone')

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
  var y = require('jquery-validation');

  module.exports = {
    data: function() {
      return {
        user: {},
        originImgPath: '',
        cropArea: {},
        originSize: {},
        uploadAvatarText: '上传头像',
        uploadAvatarDisabled: false,
        cropAreaCss: {},
        cropAreaParts: {
          'move-area': { css: { cursor: 'move' }, oldCursor: 'move' },
          'left-edge': { css: { cursor: 'w-resize' }, oldCursor: 'w-resize' },
          'top-edge': { css: { cursor: 'n-resize' }, oldCursor: 'n-resize' },
          'right-edge': { css: { cursor: 'e-resize' }, oldCursor: 'e-resize' },
          'bottom-edge': { css: { cursor: 's-resize' }, oldCursor: 's-resize' },
          'tl-corner': { css: { cursor: 'nw-resize' }, oldCursor: 'nw-resize' },
          'tm-corner': { css: { cursor: 'n-resize' }, oldCursor: 'n-resize' },
          'tr-corner': { css: { cursor: 'ne-resize' }, oldCursor: 'ne-resize' },
          'lm-corner': { css: { cursor: 'w-resize' }, oldCursor: 'w-resize' },
          'rm-corner': { css: { cursor: 'e-resize' }, oldCursor: 'e-resize' },
          'bl-corner': { css: { cursor: 'sw-resize' }, oldCursor: 'sw-resize' },
          'bm-corner': { css: { cursor: 's-resize' }, oldCursor: 's-resize' },
          'br-corner': { css: { cursor: 'se-resize' }, oldCursor: 'se-resize' },
        },
        dragInfo: {
          target: null,
          oriPos: { left: 0, top: 0 }
        },
        edgeWidth: 2,
        cornerWidth: 8
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
        var file = evt.target.files[0];

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
        var dragPart = this.cropAreaParts[evt.target.getAttribute('name')];

        this.cropAreaCss.cursor = dragPart.css.cursor;
        _.forOwn(this.cropAreaParts, function(p) {
          p.css.cursor = dragPart.css.cursor;
        });
      },

      // 拖动
      onMove: function(e) {
        var oriPos = this.dragInfo.oriPos;
        var target = this.dragInfo.target;

        if (target) {
          var offset = {
            dx: e.pageX - oriPos.left,
            dy: e.pageY - oriPos.top
          };

          if (offset.dx || offset.dy) {
            this.adjustCropArea(target.getAttribute('name'), offset);
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

          _.forOwn(this.cropAreaParts, function(p) {
            p.css.cursor = p.oldCursor;
          });

          this.dragInfo.target = null;
        }
      },

      adjustCropArea: function(target, offset) {
        var mindx, maxdx, mindy, maxdy;
        var lx, rx, th, bh;
        var dd, mindd, maxdd;

        var cropArea = this.cropArea;
        var originSize = this.originSize;
        var edgeWidth = this.edgeWidth;

        lx = cropArea.left;
        rx = originSize.width - lx - cropArea.width;
        th = cropArea.top;
        bh = originSize.height - th - cropArea.height;

        if (target == 'left-edge' || target == 'lm-corner') {
          mindx = -Math.min(lx, th);
          maxdx = cropArea.width - 2 * edgeWidth;

          if (offset.dx < mindx) offset.dx = mindx;
          if (offset.dx > maxdx) offset.dx = maxdx;

          cropArea.left   += offset.dx;
          cropArea.top    += offset.dx;
          cropArea.width  -= offset.dx;
          cropArea.height -= offset.dx;
        } else if (target == 'top-edge' || target == 'tm-corner') {
          mindy = -Math.min(th, rx);
          maxdy = cropArea.height - 2 * edgeWidth;

          if (offset.dy < mindy) offset.dy = mindy;
          if (offset.dy > maxdy) offset.dy = maxdy;

          cropArea.top    += offset.dy;
          cropArea.width  -= offset.dy;
          cropArea.height -= offset.dy;
        } else if (target == 'right-edge' || target == 'rm-corner') {
          mindx = -(cropArea.width - 2 * edgeWidth);
          maxdx = Math.min(bh, rx);

          if (offset.dx < mindx) offset.dx = mindx;
          if (offset.dx > maxdx) offset.dx = maxdx;

          cropArea.width  += offset.dx;
          cropArea.height += offset.dx;
        } else if (target == 'bottom-edge' || target == 'bm-corner') {
          mindy = -(cropArea.height - 2 * edgeWidth);
          maxdy = Math.min(lx, bh);

          if (offset.dy < mindy) offset.dy = mindy;
          if (offset.dy > maxdy) offset.dy = maxdy;

          cropArea.left   -= offset.dy;
          cropArea.width  += offset.dy;
          cropArea.height += offset.dy;
        } else if (target == 'tl-corner') {
          if (offset.dx * offset.dy < 0) return;

          dd    = (offset.dx > 0) ? Math.min(offset.dx, offset.dy) : Math.max(offset.dx, offset.dy);
          mindd = -Math.min(lx, th);
          maxdd = cropArea.width - 2 * edgeWidth;

          if (dd < mindd) dd = mindd;
          if (dd > maxdd) dd = maxdd;

          cropArea.left   += dd;
          cropArea.top    += dd;
          cropArea.width  -= dd;
          cropArea.height -= dd;
        } else if (target == 'tr-corner') {
          if (offset.dx * offset.dy > 0) return;

          dd    = (offset.dx > 0) ? Math.min(offset.dx, -offset.dy) : Math.max(offset.dx, -offset.dy);
          mindd = -(cropArea.width - 2 * edgeWidth)
          maxdd = Math.min(th, rx);

          if (dd < mindd) dd = mindd;
          if (dd > maxdd) dd = maxdd;

          cropArea.top    -= dd;
          cropArea.width  += dd;
          cropArea.height += dd;
        } else if (target == 'br-corner') {
          if (offset.dx * offset.dy < 0) return;

          dd    = (offset.dx > 0) ? Math.min(offset.dx, offset.dy) : Math.max(offset.dx, offset.dy);
          mindd = -(cropArea.width - 2 * edgeWidth)
          maxdd = Math.min(bh, rx);

          if (dd < mindd) dd = mindd;
          if (dd > maxdd) dd = maxdd;

          cropArea.width  += dd;
          cropArea.height += dd;
        } else if (target == 'bl-corner') {
          if (offset.dx * offset.dy > 0) return;

          dd    = (offset.dx > 0) ? Math.min(offset.dx, -offset.dy) : Math.max(offset.dx, -offset.dy);
          mindd = -Math.min(lx, bh);
          maxdd = cropArea.width - 2 * edgeWidth;

          if (dd < mindd) dd = mindd;
          if (dd > maxdd) dd = maxdd;

          cropArea.left   += dd;
          cropArea.width  -= dd;
          cropArea.height -= dd;
        } else {
          mindx = -lx;
          maxdx = rx;
          mindy = -th;
          maxdy = bh;

          if (offset.dx < mindx) offset.dx = mindx;
          if (offset.dx > maxdx) offset.dx = maxdx;
          if (offset.dy < mindy) offset.dy = mindy;
          if (offset.dy > maxdy) offset.dy = maxdy;

          cropArea.left += offset.dx;
          cropArea.top  += offset.dy;
        }

        this.drawCropArea();
      },

      drawCropArea: function() {
        var edgeWidth = this.edgeWidth;
        var cornerWidth = this.cornerWidth;
        var cropArea = this.cropArea;

        _.assign(this.cropAreaParts['move-area'].css, {
          left:   cropArea.left + edgeWidth,
          top:    cropArea.top + edgeWidth,
          width:  cropArea.width - 2 * edgeWidth,
          height: cropArea.height - 2 * edgeWidth
        });
        _.assign(this.cropAreaParts['left-edge'].css, _.omit(cropArea, 'width'));
        _.assign(this.cropAreaParts['top-edge'].css, _.omit(cropArea, 'height'));
        _.assign(this.cropAreaParts['right-edge'].css, {
          left:   cropArea.left + cropArea.width - edgeWidth,
          top:    cropArea.top,
          height: cropArea.height
        });
        _.assign(this.cropAreaParts['bottom-edge'].css, {
          left:   cropArea.left,
          top:    cropArea.top + cropArea.height - edgeWidth,
          width:  cropArea.width,
        });

        _.assign(this.cropAreaParts['tl-corner'].css, {
          left: cropArea.left,
          top:  cropArea.top,
        });
        _.assign(this.cropAreaParts['tm-corner'].css, {
          left: cropArea.left + (cropArea.width - cornerWidth) / 2,
          top:  cropArea.top,
        });
        _.assign(this.cropAreaParts['tr-corner'].css, {
          left: cropArea.left + cropArea.width - cornerWidth,
          top:  cropArea.top,
        });

        _.assign(this.cropAreaParts['lm-corner'].css, {
          left: cropArea.left,
          top:  cropArea.top + (cropArea.height - cornerWidth) / 2,
        });
        _.assign(this.cropAreaParts['rm-corner'].css, {
          left: cropArea.left + cropArea.width - cornerWidth,
          top:  cropArea.top + (cropArea.height - cornerWidth) / 2,
        });

        _.assign(this.cropAreaParts['bl-corner'].css, {
          left: cropArea.left,
          top:  cropArea.top + cropArea.height - cornerWidth,
        });
        _.assign(this.cropAreaParts['bm-corner'].css, {
          left: cropArea.left + (cropArea.width - cornerWidth) / 2,
          top:  cropArea.top + cropArea.height - cornerWidth,
        });
        _.assign(this.cropAreaParts['br-corner'].css, {
          left: cropArea.left + cropArea.width - cornerWidth,
          top:  cropArea.top + cropArea.height - cornerWidth,
        });
      },

      pxPrefix: function(styleObj) {
        return _.transform(styleObj, function(res, v, k) {
          if (_.isNumber(v)) res[k] = v + 'px';
          else res[k] = v;
        }, {});
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
    },

    mounted: function() {
      /**
       * 更改账号与密码
       */
      $('.js-account-edit').validate({
        rules: {
          name: 'required',
          email: 'required'
        },

        messages: {
          name: '用户名不能为空',
          email: 'Email不能为空'
        },

        submitHandler: function(form) {
          var validator = this;
          var args = $(form).serializeObject();

          $.post(form.action, args, function(data) {
            if (data.error) {
              validator.showErrors(data.errors);
            } else {
              $(form).find('.js-result-hint').text('账号修改成功').show().fadeOut(3000);
            }
          }, 'json');
        }
      });

      $('.js-password-edit').validate({
        rules: {
          old_pwd: 'required',
          new_pwd: 'required',
          c_new_pwd: { equalTo: '#new_pwd' }
        },

        messages: {
          old_pwd: '请输入旧密码',
          new_pwd: '请输入新密码',
          c_new_pwd: { equalTo: '新密码2次输入不一致' }
        },

        submitHandler: function(form) {
          var validator = this;
          var args = $(form).serializeObject();

          $.post(form.action, args, function(data) {
            if (data.error) {
              validator.showErrors(data.errors);
            } else {
              $(form).find('.js-result-hint').text('密码修改成功').show().fadeOut(3000);
            }
          }, 'json');
        }
      });
    }
  };
</script>

<style lang="sass" src='profile/account.scss'></style>
