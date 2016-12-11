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

  console.log(this.offset());

  var input               = this;
  var inputRect           = getInputRect();
  console.log(inputRect);

  var newInputAttrs = {
    labels: options.initLabels || [],
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
    $(inputNewHtml()).css(_.pick(inputRect, 'width', 'height')).insertAfter(input);
    input.hide();
  }

  function inputNewHtml() {
    var template = ''
      + '<span class="il-labels-input flex round-border relative">'
      +   '<span class="il-labels">'
      +     '<% for (let idx in labels) { %>'
      +       '<span class="il-in-lab round-border relative">'
      +         '<%= labels[idx] %>'
      +         '<i class="fa fa-times absolute" aria-hidden="true"></i>'
      +       '</span>'
      +     '<% } %>'
      +   '</span>'
      +   '<input class="il-input"></input>'
      + '</span>';

      return _.template(template)(newInputAttrs);
  }
}
