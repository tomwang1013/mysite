var $ = require('jquery');

$(document).ready(function() {
  // create job
  $('form.new-job').validate({
    rules: {
      title:    'required',
      address:  'required',
      salary:   {
        number: true,
        min:    0
      },
      duty:         'required',
      requirement:  'required'
    },

    messages: {
      title:    { required: '请输入职位名称' },
      address:  { required: '请选择工作地点' },
      salary:   {
        number: '薪资必须为数字',
        min:    '薪资必须为非负数'
      },
      duty:         { required: '请描述工作职责' },
      requirement:  { required: '请描述工作要求' },
    }
  });

  // apply job
  $('button.apply-job').click(function() {
    var me = $(this);

    $.post('/jobs/apply', {
      job_id: me.closest('tr').data('jobId')
    }, function(data) {
      if (data.error) {
        location = data.location;
      } else {
        alert(data.message);
      }
    });
  });
});
