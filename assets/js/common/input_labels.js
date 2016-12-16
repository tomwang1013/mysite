'use strict'

var $ = require('jquery');
var _ = require('lodash');

/**
 * label something through input
 * 1. show current labels on left of the input
 * 2. instant search and popup matching labels when typing
 * 3. select label from matching labels
 * 4. when typing return create this label if not exist or just add it
 *
 * options:
 * initLabels:  initial labels
 * searchUrl:   instant search url
 * addUrl:      ajax url to create label
 */
$.fn.labelIt = function(options) {
	if (!this.is("input[type='text']")) {
		return;
	}

  options = options || {};

  var input       = this;
  var form        = input.closest('form');
  var inputRect   = getInputRect();
  var curLabels   = options.initLabels || [];
  var searchUrl   = options.searchUrl || '';
  var addUrl      = options.addUrl || '';

  var popupLabDlgPos = {
    left:     inputRect.left,
    top:      inputRect.top + inputRect.height,
    width:    inputRect.width,
    position: 'absolute'
  };

  init();

  // set input's value to curLabels on form submit
  form.on('submit', function() {
    input.val(curLabels.join(','));
  });

  // get input's rect
  function getInputRect() {
    var offset    = input.offset();
    var myWidth   = parseFloat(window.getComputedStyle(input.get(0)).width);
    var myHeight  = input.outerHeight();

    return {
      left:     offset.left,
      top:      offset.top,
      width:    myWidth,
      height:   myHeight
    };
  }

  // init
  // 1. hide input
  // 2. create span + input
  // 3. show current labels on left
  function init() {
    createNewInput().insertAfter(input);
    input.hide();
    regNewInputEvents();
  }

  // event register & handle
  function regNewInputEvents() {
    form.on({
      'focus.il': function() {
        $(this).parent().css('border-color', '#00a');
      },

      'blur.il': function() {
        $(this).parent().css('border-color', '#ccc');
      },

      // prevent default form submit
      'keydown.il': function(evt) {
        return evt.which != 13;
      },

      'keyup.il': function(evt) {
        var me = $(this);
        var v = $(this).val().trim();

        // press enter to add this label
        if (evt.which == 13) {
          if (v && !_.includes(curLabels, v)) {
            $.post(addUrl, { name: v }, function(data) {
              changeCurLabels(true, v);
              $('.il-input').focus();
            });
          }

          me.val('');
          $('.il-pop-labels').remove();
          return;
        }

        // or search matching labels for select
        if (v) {
          searchMatchingLabels(v);
        }
      }
    }, '.il-input');

    // remove current label
    form.on('click.il', '.il-rm-lab', function() {
      changeCurLabels(false, $(this).prev().text());
      $('.il-input').focus();
    });

    // click on matched label and select it
    form.on('click.il', '.il-pop-lab', function() {
      var newLab = $(this).children().first().text();

      if (!_.includes(curLabels, newLab)) {
        changeCurLabels(true, newLab);
      }

      $('.il-input').val('').focus();
    });

    // close the popup labels when clicking outside
    $('html').on('click.il', function(e) {
      if (!$(e.target).closest('.il-pop-labels').length && 
          !$(e.target).closest('.il-labels-input').length) {
        $('.il-pop-labels').remove();
        $('.il-input').val('');
      }
    });
  }

  // search remote server for matching labels
  function searchMatchingLabels(name) {
    $.get(searchUrl, { name: name }, function(data) {
      if (data.error || !data.labels.length) {
        return;
      }

      $('.il-pop-labels').remove();
      input.after(popupLabels(data.labels));
    });
  }

  // add or remove label from curLabels
  function changeCurLabels(isAdd, name) {
    if (isAdd) {
      curLabels.push(name);
      $('.il-labels').append(
        '<span class="il-in-lab round-border relative">' +
          '<span>' + name + '</span>' +
          '<span class="fa fa-times il-rm-lab absolute" aria-hidden="true"></span>' +
        '</span>'
      );
    } else {
      _.pull(curLabels, name);
      $('.il-lab-name:contains(' + name + ')').parent().remove();
    }
  }

  // new input to replace the default input
  function createNewInput() {
    var template = ''
      + '<span class="il-labels-input flex round-border relative">'
      +   '<span class="il-labels">'
      +     '<% for (let idx in labels) { %>'
      +       '<span class="il-in-lab round-border relative">'
      +         '<span class="il-lab-name"><%= labels[idx] %></span>'
      +         '<span class="fa fa-times il-rm-lab absolute" aria-hidden="true"></span>'
      +       '</span>'
      +     '<% } %>'
      +   '</span>'
      +   '<input class="il-input"></input>'
      + '</span>';

    return $(_.template(template)({
      labels: curLabels
    })).css(_.pick(inputRect, 'width', 'height'));
  }

  // popup dlg for matching labels
  function popupLabels(matchingLabels) {
    var template = ''
      + '<div class="il-pop-labels small-font">'
      +   '<ul class="nav">'
      +     '<% for (let lab of labels) { %>'
      +       '<li class="il-pop-lab round-border">'
      +         '<span><%= lab.name %></span>'
      +         '<span><%= lab.ques_cnt %></span>'
      +       '</li>'
      +     '<% } %>'
      +   '</ul>'
      + '</div>';

    return $(_.template(template)({
      labels: matchingLabels
    })).css(popupLabDlgPos);
  }
}
