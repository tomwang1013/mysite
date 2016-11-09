var $ = require('jquery');

$(document).ready(function() {
  $('#university').popupList({ remoteUrl: '/universities' });
  $('#major').popupTabs(window.ms);

  $('form.signup').validate({
    errorPlacement: function(error, element) {
      error.insertBefore(element);
    }
  });
});
