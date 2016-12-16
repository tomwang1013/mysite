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
 * remoteUrl: remote url to get the items
 */
$.fn.popupListNoSb = function(options) {
	if (!this.is("input[type='text']")) {
		return;
	}

  var input               = this;
  var items               = [];
  var itemHeight          = 0;  // item height
  var maxVisibleItemsCnt  = 10; // max count of visible items
  var hlItemIdx           = -1; // highlight item index select by keyboard
  var visibleIdxRange     = {   // current visible index range
    start: 0,
    end:   maxVisibleItemsCnt - 1
  };

  input.on('keydown.list', function(evt) {
    return evt.which != 13;
  });

  // instant search when keydown
  input.on('keyup.list', function(evt) {
    var newKeyword = $(this).val().trim();
    var itemsContainer = $('.pl-no-sb');
    var itemsList      = $('.pl-no-sb li');

    switch (evt.which) {
      case 38:  // arrow up
        if (hlItemIdx > 0) {
          itemsList.eq(hlItemIdx).removeClass('popuplist-item-active');
          itemsList.eq(--hlItemIdx).addClass('popuplist-item-active');

          if (hlItemIdx < visibleIdxRange.start) {
            itemsContainer.scrollTop(itemsContainer.scrollTop() - itemHeight);
            visibleIdxRange.start--;
            visibleIdxRange.end--;
          }
        }
        break;

      case 40:  // arrow down
        if (hlItemIdx < itemsList.length - 1) {
          itemsList.eq(hlItemIdx).removeClass('popuplist-item-active');
          itemsList.eq(++hlItemIdx).addClass('popuplist-item-active');

          if (hlItemIdx > visibleIdxRange.end) {
            itemsContainer.scrollTop(itemsContainer.scrollTop() + itemHeight);
            visibleIdxRange.start++;
            visibleIdxRange.end++;
          }
        }
        break;

      case 13:  // enter
        if (0 <= hlItemIdx && hlItemIdx < itemsList.length) {
          input.val(itemsList.eq(hlItemIdx).text());
          hideList();
        }
        break;

      default:  // get matched words from server and popup list
        if (newKeyword) {
          $.get(options.remoteUrl, { kw: newKeyword }, function(data) {
            items = data.items;
            hideList();
            if (items.length) showList();
          });
        }
        break;
    }
  });

  // close popuplist when clicking outside
  $('html').on('click.list', function(e) {
    if (!$(e.target).closest('.pl-no-sb').length && 
        !$(e.target).closest(input).length) {
      hideList();
    }
  });

  // click to select an item
  input.closest('form').on('click.list', '.pl-no-sb li', function() {
    input.val($(this).text());
    hideList();
    return false;
  });

  // show the list: popup it
  function showList() {
    input.after($(createList()).css(getDimensionStyle()));
    itemHeight = $('.pl-no-sb li').outerHeight();
    $('.pl-no-sb').css({
      'max-height': itemHeight * maxVisibleItemsCnt,
      'min-height': itemHeight,
    });
  }

  // hide the list
  function hideList() {
    $('.pl-no-sb').remove();
    visibleIdxRange.start = 0;
    visibleIdxRange.end = maxVisibleItemsCnt - 1
    hlItemIdx = -1;
  }

  // get pos & size of pop list
  function getDimensionStyle() {
    var offset    = input.offset();
    var myWidth   = parseFloat(window.getComputedStyle(input.get(0)).width);
    var myHeight  = input.outerHeight() - 1;

    return {
      position: 'absolute',
      left:     offset.left,
      top:      offset.top + myHeight + 1,
      width:    options.with || myWidth
    };
  }

  // UI rendering
  function createList() {
    var template = ''
      + '<div class="pl-no-sb small-font">'
      +   '<ul class="nav">'
      +     '<% for (let idx in items) { %>'
      +       '<% if (idx == hlItemIdx) {%>'
      +         '<li class="popuplist-item-active"><%= items[idx] %></li>'
      +       '<% } else {%>'
      +         '<li><%= items[idx] %></li>'
      +       '<% } %>'
      +     '<% } %>'
      +   '</ul>'
      + '</div>';

    return _.template(template)({
      items: items,
      hlItemIdx: hlItemIdx
    });
  }
};
