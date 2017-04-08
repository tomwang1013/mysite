var $ = require('jquery');
var w = require('common/global');
var v = require('job/appliers.scss');

// pass or refuse applying
$('.js-apply-op > button').click(function() {
  var me = $(this);
  var confirm = me.closest('.c-applier').find('.js-op-message');
  var message;
  var status;

  me.parent().hide();
  confirm.show();

  if (me.text() == '通过') {
    message = '恭喜你通过审核：';
    status = 2;
  } else {
    message = '很遗憾你暂时不适合这个岗位：';
    status = 1;
  }

  confirm.find('textarea').data('status', status).val(message).focus();
});

// 处理学生的职位申请请求
$('.js-op-message button:first-child').click(function() {
  var me = $(this);
  var c = $(this).closest('.c-applier');
  var userId = c.data('userId');
  var jobId  = c.data('jobId');
  var t = me.closest('.js-op-message').find('textarea');
  var status = t.data('status');
  var message = t.val();

  $.post('/job/' + jobId + '/handle_apply', {
    userId:   userId,
    jobId:    jobId,
    status:   status,
    message:  message
  }, function(data) {
    var resultHtml;

    if (status == 1) {
      resultHtml = "<div class='u-error-result'>已拒绝：" + message + "</div>";
    } else {
      resultHtml = "<div class='u-success-result'>已通过：" + message + "</div>";
    }

    me.closest('.js-op-message').replaceWith(resultHtml);
  });
});

$('.js-op-message button:last-child').click(function() {
  $(this).closest('.js-op-message').hide();
  $(this).closest('.c-applier').find('.js-apply-op').show();
});
