var $ = require('jquery');

$(function() {
  $('#company_name').popupListNoSb({
    remoteUrl: '/users/queryByCompanyName'
  });
});

