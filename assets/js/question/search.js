var $ = require('jquery');
var x = require('common/popup_list_no_sb');
var y = require('common/main_nav');

$(function() {
  $('#company_name').popupListNoSb({
    remoteUrl: '/users/queryByCompanyName'
  });
});

