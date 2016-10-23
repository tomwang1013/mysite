var $ = require('jquery');

$(document).ready(function() {
  $('#university').popupTabs(window.us);
  $('#major').popupTabs(window.ms);
  $('.rich-editor').each(function(idx, ele) {
    CKEDITOR.replace(ele.id);
  });

  $('form.signup').validate({
    errorPlacement: function(error, element) {
      error.insertBefore(element);
    }
  });
});
