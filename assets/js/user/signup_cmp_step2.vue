<template lang='pug'>
  form-validator(method='post', action='/signup_step2', class='c-signup-step-fm', v-bind='$data')
    // 公司信息
    .o-fm-grp.u-small-font.u-center-text 请务必完善企业信息，否则发布的职位可能不会被求职者看到

    .o-fm-grp
      label(for='url') 公司主页：
      input(type='url', name='url', id='url', class='o-fm-ctl')

    .o-fm-grp
      label(for='business') 所属行业：
      select(name='business', id='business', class='o-fm-ctl')
        option(value='') 请选择行业
        each b in businesses
          option(value=b)= b

    .o-fm-grp
      label(for='scale') 规模：
      select(name='scale', id='scale', class='o-fm-ctl')
        option(value='') 请选择企业规模
        each s,i in scales
          option(value=i)= s

    .o-fm-grp
      label(for='maturity') 成熟度：
      select(name='maturity', id='maturity', class='o-fm-ctl')
        option(value='') 请选择企业成熟度
        each m,i in maturities
          option(value=i)= m

    .o-fm-grp
      label(for='desc') 介绍：
      textarea(name='desc', id='desc', class='u-rich-editor')
</template>

<script>
  var FV  = require('vue-form-validator');

  module.exports = {
    name: 'signup-company-step2',

    data: function() {
      return {
        rules: {
          url: {
            required: true,
            url: true
          },
          business: 'required',
          scale:    'required',
          maturity: 'required',
          desc: {
            required: true,
            ta_minlength: 30
          }
        },

        messages: {
          url: {
            required: '请指定公司主页',
            url: 'url格式错误'
          },
          business: '请选择所属行业',
          scale:    '请选择企业规模',
          maturity: '请选择企业成熟度',
          desc: {
            required: '公司介绍不能为空',
            ta_minlength: "公司介绍应至少包含 {0} 个字符"
          }
        }
      }
    }
  };
</script>
