var $ = require('jquery');
var x = require('common/popup_list_no_sb');
var y = require('common/global');

var css = require('question/list.scss');

$(function() {
  $('#company_name').popupListNoSb({
    remoteUrl: '/users/queryByCompanyName'
  });
});
