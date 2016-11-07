var $ = require('jquery');

$(document).ready(function() {
  $('#university').popupTabs(window.us);
  $('#major').popupTabs(window.ms);

  $('form.signup').validate({
    errorPlacement: function(error, element) {
      error.insertBefore(element);
    }
  });
});
