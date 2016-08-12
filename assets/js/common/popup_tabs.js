'use strict'

var $ = require('jquery');

/**
 * data format:
 * 1 level: [a1, a2, ...]
 * 2 levels: { a1: [b11, b12, ...], a2: [b21, b22, ...], ... }
 * 3 levels: { a1: { b11: [c1111, c1112, ...], b12: [c1121, c1122, ...], ... },
 *			   a2: { b21: [c2211, c2212, ...], b12: [c2121, c2122, ...], ... }}
 */
$.fn.popupTabs = function(options) {
	if (!this.is("input[type='text']")) {
		return;
	}

  var input     = this;
	var labels    = options.labels;
	var data      = options.data;
	var offset    = this.offset();
	var myWidth   = this.outerWidth();
	var myHeight  = this.outerHeight();

  var style     = {
		position: 'absolute',
		left:     offset.left + 'px',
		top:      (offset.top + myHeight) + 'px',
		width:    (options.with || 1.5 * myWidth) + 'px'
	};

  var state     = {
		labels:         labels.slice(0, 1),
		items:          Object.keys(data),
    activeLabel:    labels[0],
    activeItem:     '',
    selectedItems:  []
	};

	var dialog = $(createTabs()).css(style).hide();
	input.after(dialog);

	// switch tab
	$(document).delegate('.tab-header li', 'click', function() {
		if ($(this).is('.tab-label-active')) {
      return;
    }

    state.activeLabel = $(this).text();

    var level = state.labels.indexOf(state.activeLabel);
    var curData = data;

    for (var i = 0; i < level; i++) {
      curData = curData[state.selectedItems[i]];
    }

    if (curData instanceof Array) {
      state.items = curData;
    } else {
      state.items = Object.keys(curData);
    }

    state.activeItem  = state.selectedItems[level];
    refreshTabs();
	});

  // select item of the active tab
	$(document).delegate('.tab-content li', 'click', function() {
    var level = state.labels.indexOf(state.activeLabel);
    var clickItem = $(this).text();

    state.selectedItems[level] = clickItem;

    if (level == labels.length - 1) {
      input.val(clickItem);
      hideDialog();
      return;
    }

    var curData = data;

    for (var i = 0; i <= level; i++) {
      curData = curData[state.selectedItems[i]];
    }

    if (curData instanceof Array) {
      state.items = curData;
    } else {
      state.items = Object.keys(curData);
    }

    if (!state.labels[level + 1]) {
      state.labels[level + 1] = labels[level + 1];
    }

    state.activeLabel = state.labels[level + 1];
    refreshTabs();
	});

  function refreshTabs() {
    dialog = $(createTabs()).css(style).replaceAll(dialog);
  }

	// disable manually input, force select from tabs
	this.keypress(function() {
		return false;
	});

	this.focus(function(e) {
		showDialog();
	});


  // create dialog for state
	function createTabs() {
    var template = ''
      + '<div class="tab-container">'
      +   '<div class="tab-header">'
      +     '<ul>'
      +       '<% for (let label of state.labels) { %>'
      +         '<% if (state.activeLabel == label) { %>'
      +           '<li class="tab-label-active"><%= label %></li>'
      +         '<% } else { %>'
      +           '<li><%= label %></li>'
      +         '<% } %>'
      +       '<% } %>'
      +     '</ul>'
      +   '</div>'
      +   '<div class="tab-content">'
      +     '<ul>'
      +       '<% for (let item of state.items) { %>'
      +         '<% if (state.activeItem == item) { %>'
      +           '<li class="tab-item-active"><%= item %></li>'
      +         '<% } else { %>'
      +           '<li><%= item %></li>'
      +         '<% } %>'
      +       '<% } %>'
      +     '</ul>'
      +   '</div>'
      + '</div>';

    return (eval(compile(template)))(state);
	}

	function showDialog() {
    dialog.show();

		$('html').bind('click.tab', function(e) {
      if (!$(e.target).closest(dialog.add(input)).length) {
        hideDialog();
      }
    });
	}

	function hideDialog() {
    $('html').unbind('click.tab');
	  dialog.hide();
	}

	function compile(template) {
	  var evalExpr = /<%=(.+?)%>/g;
	  var expr = /<%([\s\S]+?)%>/g;

	  template = template
      .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
      .replace(expr, '`); \n $1 \n  echo(`');

	  template = 'echo(`' + template + '`);';

    var script = ''
      + '(function parse(state) {'
      +   'var output = "";'
      +   'function echo(html){'
      +     'output += html;'
      +   '}'
      +   template
      +   'return output;'
      + '});'

    return script;
	}
}
