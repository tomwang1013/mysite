'use strict'

var $ = require('jquery');
var _ = require('lodash');

/**
 * when user click an input, popup a list and let the user select
 * from it; user can't input other things; if the list is too long,
 * add an input above it and do instant search; support keyboard
 * select
 *
 * options:
 * items: items to show in the list
 * remoteUrl: remote url to get the items
 * remoteData: data passed to remoteUrl if it is present
 */
$.fn.popupList = function(options) {
	if (!this.is("input[type='text']")) {
		return;
	}

  var input     = this;
  var list      = null;
  var allItems  = options.items || [];
  var items     = [];

  input.prop('readonly', true);

  if (!allItems.length && options.remoteUrl) {
    $.get(options.remoteUrl, options.remoteData || {}, function(data) {
      items = allItems = data;
    });
  }

	this.focus(function(e) {
    if (!list) {
      showList();
    }
	});

  // show the list: popup it
  function showList() {
    list = $(createList()).css(getDimensionStyle());
    input.after(list);

    /**
     * interaction events
     */

    // click to select an item
    $('.popuplist-items li').on('click.list', function() {
      input.val($(this).text());
      hideList();
      return false;
    });

    // instant search when keydown
    $('.popuplist-searchbar input').on('keydown.list', function() {
      var keyword = $(this).val();

      items = _.filter(allItems, function(item, idx) {
        return item.indexOf(keyword) != -1;
      });

      list = $(createList()).css(getDimensionStyle()).replaceAll(list);
    });

		$('document').on('click.list', function(e) {
      if (!$(e.target).closest('.popuplist-container').length && 
          !$(e.target).closest(input).length) {
        hideList();
      }
    });
  }

  // hide the list
  function hideList() {
    list.remove();
    list = null;
    $('.popuplist-items li').off('click.list');
    $('.popuplist-searchbar input').off('keydown.list');
		$('document').off('click.list');
  }

  // get pos & size of pop list
  function getDimensionStyle() {
    var offset    = input.offset();
    var myWidth   = parseFloat(window.getComputedStyle(input.get(0)).width);
    var myHeight  = input.outerHeight() - 1;

    return {
      position: 'absolute',
      left:     offset.left + 'px',
      top:      (offset.top + myHeight) + 'px',
      width:    (options.with || myWidth) + 'px'
    };
  }

  // UI rendering
  function createList() {
    var template = ''
      + '<div class="popuplist-container small-font">'
      +   '<% if (items.length > minSearchItemsCount) { %>'
      +     '<div class="popuplist-searchbar">'
      +       '<input type="text">'
      +     '</div>'
      +   '<% } %>'
      +   '<div class="popuplist-items">'
      +     '<ul class="nav">'
      +       '<% for (let item of items) { %>'
      +         '<li><%= item %></li>'
      +       '<% } %>'
      +     '</ul>'
      +   '</div>'
      + '</div>';

      return _.template(template, {
        items: items,
        minSearchItemsCount: 8
      });
  }
};
