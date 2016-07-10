var $ = require('jquery');
var common = require('./common');

/**
 * 1. field validation
 * 2. validation passed, post info to server to signup the user
 * 3. if server validation passed, open new page got from server;
 *    else show error and go back to #1 
 */
$('form.login').submit(function() {
  var name = $('#name').val().trim();
  var password = $('#password').val().trim();

  // presence
  var invalid = ['name', 'password'].some(function(attr) {
    var id = '#' + attr;
    var value = $(id).val().trim();
    var label = $('[for=' + attr + ']').text().slice(0, -1);

    if (!value) {
      $(id).addClass('error').focus();
      $(id + ' + span').text('请指定' + label).show();
      return true;
    } else {
      $(id).removeClass('error');
      $(id + ' + span').hide();
      return false;
    }
  });

  if (invalid) return false;

  // client validation passed, submit to server
  $.post($(this).attr('action'), $(this).serializeObject(), function(data) {
    if (data.error) {
      $(':submit + span').text(data.message).show();
    } else {
      location = data.location;
    }
  });

  return false;
});
