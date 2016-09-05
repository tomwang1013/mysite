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

  var state     = {
		labels:         labels.slice(0, 1),
		items:          Object.keys(data),
    activeLabel:    labels[0],
    activeItem:     '',
    selectedItems:  []
	};

  var dialog;

  // initialize state by input's initial value
  function initState() {
    var initItem = input.val();

    if (!initItem) return;

    // TODO
  }

  function refreshLevelItems(level) {
    var curData = data;

    for (var i = 0; i <= level; i++) {
      curData = curData[state.selectedItems[i]];
    }

    if (curData instanceof Array) {
      state.items = curData;
    } else {
      state.items = Object.keys(curData);
    }
  }

  // select the click item
  function selectClickItem(clickItem) {
    input.val(clickItem);
    hideDialog();

    // for jquery-validation plugin
    input.trigger('focusout.validate');
    input.trigger('change');
  }

  // get pos & size of pop dialog
  function getDimensionStyle() {
    var offset    = input.offset();
    var myWidth   = Math.ceil(parseFloat(window.getComputedStyle(input.get(0)).width));
    var myHeight  = input.outerHeight() - 1;

    return {
      position: 'absolute',
      left:     offset.left + 'px',
      top:      (offset.top + myHeight) + 'px',
      width:    (options.with || myWidth) + 'px'
    };
  }

  function refreshTabs() {
    dialog = $(createTabs()).css(getDimensionStyle()).replaceAll(dialog);
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
    dialog = $(createTabs()).css(getDimensionStyle());

    // click on tabs
    $(document).on('click', '.tab-header li', function(e) {
      if ($(this).is('.tab-label-active')) {
        return;
      }

      var level = state.labels.indexOf($(this).text());

      state.activeLabel = $(this).text();
      refreshLevelItems(level - 1);
      state.activeItem  = state.selectedItems[level];
      refreshTabs();
    });

    // click on item
    $(document).on('click', '.tab-content li', function(e) {
      var level = state.labels.indexOf(state.activeLabel);
      var clickItem = $(this).text();

      state.selectedItems[level] = clickItem;

      // click in the last tab's items, select it
      if (level == labels.length - 1) {
        selectClickItem(clickItem);
        return;
      }

      var oldItems = state.items;

      refreshLevelItems(level);

      // this item has no sub-level items, so just select it
      if (!state.items.length) {
        state.items = oldItems;
        selectClickItem(clickItem);
        return;
      }

      if (!state.labels[level + 1]) {
        state.labels[level + 1] = labels[level + 1];
      }

      state.activeLabel = state.labels[level + 1];
      refreshTabs();
    });

    input.after(dialog);

		$('html').bind('click.tab', function(e) {
      if (!$(e.target).closest('.tab-container').length && 
          !$(e.target).closest(input).length) {
        hideDialog();
      }
    });
	}

	function hideDialog() {
	  dialog.remove();
    dialog = null;
    $(document).off('click', '.tab-header li')
    $(document).off('click', '.tab-content li')
		$('html').unbind('click.tab');
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
