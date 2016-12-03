var $ = require('jquery');

$(document).ready(function() {
  $('#university').popupList({ remoteUrl: '/universities' });
  $('#major').popupTabs(window.ms);
  $('form#signup-step1').validate({
    rules: {
      name: {
        remote: '/signup/is_valid_name'
      },

      email: {
        remote: '/signup/is_valid_email'
      },
    }
  });

  $('form#signup-step2').validate();
  $('form.login').validate();
});
