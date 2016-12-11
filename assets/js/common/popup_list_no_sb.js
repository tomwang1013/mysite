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
 * itemsPinyin: chinese pinyin of items
 * remoteUrl: remote url to get the items
 * remoteData: data passed to remoteUrl if it is present
 */
$.fn.popupList = function(options) {
	if (!this.is("input[type='text']")) {
		return;
	}

  var input               = this;
  var list                = null;
  var items               = options.items || [];
  var itemsPinyin         = options.itemsPinyin || {};
  var itemHeight          = 0;  // item height
  var maxVisibleItemsCnt  = 10; // max count of visible items

  var keyword             = ''; // search keyword
  var hlItemIdx           = -1; // highlight item index select by keyboard
  var visibleIdxRange     = {   // current visible index range
    start: 0,
    end:   maxVisibleItemsCnt - 1
  };

  input.prop('readonly', true);

  if (!items.length && options.remoteUrl) {
    $.get(options.remoteUrl, options.remoteData || {}, function(data) {
      items = data.items;
      itemsPinyin = data.itemsPinyin;
    });
  }

	input.focus(function(e) {
    if (!list) {
      showList();
    }
	});

  function changeInputValue(nv) {
    input.val(nv).trigger('change');
    hideList();
    visibleIdxRange.start = 0;
    visibleIdxRange.end = maxVisibleItemsCnt - 1
    hlItemIdx = -1;
    keyword = '';
  }

  // show the list: popup it
  function showList() {
    list = $(createList()).css(getDimensionStyle());
    input.after(list);
    itemHeight = $('.popuplist-items li').outerHeight();
    $('.popuplist-items').css({
      'max-height': itemHeight * maxVisibleItemsCnt,
      'min-height': itemHeight,
      'overflow':   'auto'
    });

    var searchbarInput = $('.popuplist-searchbar input');
    var itemsContainer = $('.popuplist-items');
    var itemsList      = $('.popuplist-items li');

    searchbarInput.focus().val(keyword);

    /**
     * interaction events
     */

    // click to select an item
    itemsList.on('click.list', function() {
      changeInputValue($(this).text());
      return false;
    });

    // instant search when keydown
    searchbarInput.on('keyup.list', function(evt) {
      var newKeyword = $(this).val().trim();

      if (newKeyword != keyword) {
        itemsList.filter(function(idx, ele) {
          var name = $(this).text();
          return !_.startsWith(name, newKeyword) && 
                 !_.startsWith(itemsPinyin[name], newKeyword);
        }).hide();

        itemsList.filter(function(idx, ele) {
          var name = $(this).text();
          return _.startsWith(name, newKeyword) ||
                 _.startsWith(itemsPinyin[name], newKeyword);
        }).show();

        keyword = newKeyword;
        hlItemIdx = -1;
      } else {
        var visibleItemsList = itemsList.filter(':visible');

        switch (evt.which) {
          case 38:  // arrow up
            if (hlItemIdx > 0) {
              visibleItemsList.eq(hlItemIdx).removeClass('popuplist-item-active');
              visibleItemsList.eq(--hlItemIdx).addClass('popuplist-item-active');

              if (hlItemIdx < visibleIdxRange.start) {
                itemsContainer.scrollTop(itemsContainer.scrollTop() - itemHeight);
                visibleIdxRange.start--;
                visibleIdxRange.end--;
              }
            }
            break;
          case 40:  // arrow down
            if (hlItemIdx < visibleItemsList.length - 1) {
              visibleItemsList.eq(hlItemIdx).removeClass('popuplist-item-active');
              visibleItemsList.eq(++hlItemIdx).addClass('popuplist-item-active');

              if (hlItemIdx > visibleIdxRange.end) {
                itemsContainer.scrollTop(itemsContainer.scrollTop() + itemHeight);
                visibleIdxRange.start++;
                visibleIdxRange.end++;
              }
            }
            break;
          case 13:  // enter
            if (0 <= hlItemIdx && hlItemIdx < visibleItemsList.length) {
              changeInputValue(visibleItemsList.eq(hlItemIdx).text());
            }
            break;
        }
      }
    });

		$('html').on('click.list', function(e) {
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
		$('html').off('click.list');
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
        hlItemIdx: hlItemIdx,
        minSearchItemsCount: 10
      });
  }
};