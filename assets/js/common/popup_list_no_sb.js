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
$.fn.popupList = function(options) {
	if (!this.is("input[type='text']")) {
		return;
	}

  var input               = this;
  var items               = [];
  var itemHeight          = 0;  // item height
  var maxVisibleItemsCnt  = 10; // max count of visible items

  var keyword             = ''; // search keyword
  var hlItemIdx           = -1; // highlight item index select by keyboard
  var visibleIdxRange     = {   // current visible index range
    start: 0,
    end:   maxVisibleItemsCnt - 1
  };

  // instant search when keydown
  input.on('keyup.list', function(evt) {
    var newKeyword = $(this).val().trim();

    if (newKeyword != keyword) {
      // get matched words from server and popup list
      $.get(remoteUrl, { kw: newKeyword }, function(data) {
        items = data.items;
        keyword = newKeyword;
        showList();
      });
    } else {
      var itemsContainer = $('.popuplist-items');
      var itemsList      = $('.popuplist-items li');

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
      }
    }
  });

  // close popuplist when clicking outside
  $('html').on('click.list', function(e) {
    if (!$(e.target).closest('.popuplist-container').length && 
        !$(e.target).closest(input).length) {
      hideList();
    }
  });

  // click to select an item
  input.closest('form').on('click.list', '.popuplist-items li', function() {
    input.val($(this).text());
    hideList();
    return false;
  });

  // show the list: popup it
  function showList() {
    input.after($(createList()).css(getDimensionStyle()));
    itemHeight = $('.popuplist-items li').outerHeight();
    $('.popuplist-items').css({
      'max-height': itemHeight * maxVisibleItemsCnt,
      'min-height': itemHeight,
      'overflow':   'auto'
    });
  }

  // hide the list
  function hideList() {
    $('.popuplist-container').remove();
    visibleIdxRange.start = 0;
    visibleIdxRange.end = maxVisibleItemsCnt - 1
    hlItemIdx = -1;
    keyword = '';
  }

  // get pos & size of pop list
  function getDimensionStyle() {
    var offset    = input.offset();
    var myWidth   = parseFloat(window.getComputedStyle(input.get(0)).width);
    var myHeight  = input.outerHeight() - 1;

    return {
      position: 'absolute',
      left:     offset.left,
      top:      offset.top + myHeight,
      width:    options.with || myWidth
    };
  }

  // UI rendering
  function createList() {
    var template = ''
      + '<div class="popuplist-container small-font">'
      +   '<div class="popuplist-items">'
      +     '<ul class="nav">'
      +       '<% for (let idx in items) { %>'
      +         '<% if (idx == hlItemIdx) {%>'
      +           '<li class="popuplist-item-active"><%= items[idx] %></li>'
      +         '<% } else {%>'
      +           '<li><%= items[idx] %></li>'
      +         '<% } %>'
      +       '<% } %>'
      +     '</ul>'
      +   '</div>'
      + '</div>';

    return _.template(template)({
      items: items,
      hlItemIdx: hlItemIdx
    });
  }
};
