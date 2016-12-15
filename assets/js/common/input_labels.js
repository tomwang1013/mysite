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
  var inputRect   = getInputRect();
  var curLabels   = options.initLabels || [];
  var searchUrl   = options.searchUrl || '';
  var addUrl      = options.addUrl || '';
  var newInput    = null;
  var popupLabDlg = null;

  var popupLabDlgPos = {
    left:     inputRect.left,
    top:      inputRect.top + inputRect.height,
    width:    inputRect.width,
    position: 'absolute'
  };

  init();

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
    newInput = createNewInput().insertAfter(input);
    input.hide();
    regNewInputEvents();
  }

  // event register & handle
  function regNewInputEvents() {
    $('.il-labels-input').on({
      'focus.il': function() {
        $(this).parent().css('border-color', '#00a');
      },

      'blur.il': function() {
        $(this).parent().css('border-color', '#ccc');
      },

      'keyup.il': function(evt) {
        var me = $(this);
        var v = $(this).val().trim();

        // press enter to add this label
        if (evt.which == 13) {
          if (v) {
            $.post(addUrl, { name: v }, function(data) {
              changeCurLabels(true, v);
            });
          }

          me.val('');
          if (popupLabDlg) popupLabDlg.hide();
          return;
        }

        // or search matching labels for select
        searchMatchingLabels(m.val());
      }
    }, '#il-input');

    $('.il-labels-input').on('click.il', '.il-rm-lab', function() {
      changeCurLabels(false, curLabels, $(this).prev().text());
    });
  }

  // search remote server for matching labels
  function searchMatchingLabels(name) {
    $.get(searchUrl, name, function(data) {
      if (data.error || !data.matchingLabels.length) return;

      var newDlg = $(popupLabelsHtml(data.matchingLabels)).css(popupLabDlgPos);

      if (popupLabDlg) {
        popupLabDlg = popupLabDlg.replaceWith(newDlg);
      } else {
        popupLabDlg = newDlg;

        // click on matched label and select it
        $('.il-pop-labels').on('click.il', '.il-pop-lab', function() {
          changeCurLabels(true, $(this).children().first().text());
          popupLabDlg.hide();
        });

        $('html').on('click.il', function(e) {
          if (!$(e.target).closest('.il-pop-labels').length && 
              !$(e.target).closest('.il-labels-input').length) {
            hideDialog();
          }
        });

        input.after(popupLabDlg);
      }

      popupLabDlg.show();
    }
  }

  function changeCurLabels(isAdd, name) {
    if (isAdd) {
      curLabels.push(name);
    } else {
      _.pull(curLabels, name);
    }

    newInput = newInput.replaceWith(createNewInput());
  }

  // new input to replace the default input
  function createNewInput() {
    var template = ''
      + '<span class="il-labels-input flex round-border relative">'
      +   '<span class="il-labels">'
      +     '<% for (let idx in labels) { %>'
      +       '<span class="il-in-lab round-border relative">'
      +         '<span><%= labels[idx] %></span>'
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
  function popupLabelsHtml(matchingLabels) {
    var template = ''
      + '<div class="il-pop-labels small-font">'
      +   '<ul class="nav">'
      +     '<% for (let lab of labels) { %>'
      +       '<li class="il-pop-lab">'
      +         '<span><%= lab.name %></span>'
      +         '<span><%= lab.ques_cnt %></span>'
      +       '</li>'
      +     '<% } %>'
      +   '</ul>'
      + '</div>';

      return _.template(template)({
        labels: matchingLabels
      });
  }
}
