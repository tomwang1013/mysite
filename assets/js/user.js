var $ = require('jquery');

$(document).ready(function() {
  $('#university').popupList({ remoteUrl: '/universities' });
  $('#major').popupTabs(window.ms);
  $('form.signup').validate();
  $('form.login').validate();
});
