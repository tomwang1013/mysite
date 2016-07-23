var $ = require('jquery');
var common = require('./common');

/**
 * 1. field validation
 * 2. validation passed, post info to server to signup the user
 * 3. if server validation passed, open new page got from server;
 *    else show error and go back to #1 
 */
$('form.signup').submit(function() {
  var name = $('#name').val().trim();
  var email = $('#email').val().trim();
  var password = $('#password').val().trim();

  // presence
  var invalid = ['name', 'email', 'password'].some(function(attr) {
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

  // format validation
  var validEmailFormat = /\w+@\w+(\.[a-z0-9]{2,12})?\.[a-z]{2,12}/; 

  if (!validEmailFormat.test(email)) {
    $('#email').addClass('error').focus();
    $('#email + span').text('邮箱格式不对').show();
    return false;
  } else {
    $('#email').removeClass('error');
    $('#email + span').hide();
  }

  var validPasswordFormat = /([\d]+\S*[a-zA-Z]+\S*)|([a-zA-Z]+\S*\d+\S*)/;
  if (password.length < 8 || !validPasswordFormat.test(password)) {
    $('#password').addClass('error').focus();
    $('#password + span').text('密码格式不对').show();
    return false;
  } else {
    $('#password').removeClass('error');
    $('#password + span').hide();
  }

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

$(':radio[name=user_type]').change(function() {
  $('fieldset.student, fieldset.company').toggle();
  //var t = $(this).val();

  //if (t == 0) {
    //$('fieldset.student').show();
    //$('fieldset.company').hide();
  //} else {
    //$('fieldset.student').show();
    //$('fieldset.company').hide();
  //}
});
