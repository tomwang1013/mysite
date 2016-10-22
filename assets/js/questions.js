var $ = require('jquery');

$(function() {
  $('.del-question').click(function() {
    var me = $(this);

    if (window.confirm('确定要删除这个题目吗？')) {
      $.post(me.data('url'), { deleted: 1 }, function(data) {
        me.closest('.question').remove();
      }, 'json');
    }
  });
});
