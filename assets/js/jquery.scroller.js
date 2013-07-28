/**
 * @codekit-prepend "vendor/jquery.js", "vendor/jquery.accordion.js", "vendor/jquery.cookie.js";
 */

var scroller = (function($) {

	/**
	 * Object that scroller
	 * was called on
	 * @type {jQuery object}
	 */
	var _obj;

	/**
	 * Default options
	 * @type {Object}
	 */
	var _defaultOptions = {
		downText: "down",
		upText: "up",
		header: "h2",
		maxDisplay: 5
	};

	/**
	 * Options requested by the user
	 * after being merged with the
	 * default options.
	 * @type {Object}
	 */
	var _options = {};

	/**
	 * Height of the thumbnails
	 * @type {Integer}
	 */
	var _thumbHeight;

	/**
	 * HTML used for each accordion
	 * group's navigation.
	 * @type {jQuery Object}
	 */
	var _navigation;


	/**
	 * Configure height and add navigation,
	 * if necessary, to each group in the
	 * accordion menu.
	 */
	function configureGroups() {
		var groups = _obj.find(".thumbs");

		// find height of the thumbs
		_thumbHeight = groups.find("img").first().outerHeight(true);

		// wrap thumbs in a container that can have a hard height
		groups.wrap("<div class='thumbs_container' />");

		var containers = groups.parent(".thumbs_container");
		$.each(containers, function() {
			contain($(this));
			addNav($(this));
		});
		
	}

	/**
	 * Set a hard height on the container
	 * @param  {jQuery Object} container
	 * @return null
	 */
	function contain(container) {
		var height;
		var numThumbs = container.find("img").length;

		if (numThumbs >= _options.maxDisplay) {
			height = _thumbHeight * _options.maxDisplay;
		} else {
			height = _thumbHeight * numThumbs;
		}
		
		container.css({
			height: height,
			overflow: "hidden"
		});
	}

	/**
	 * Create navigation HTML
	 * @return {object} jQuery DOM object
	 */
	function navHtml() {
		var nav = $("<div />").addClass("scroll-nav");
		$("<a />").addClass("up").attr("href", "#").html(_options.upText).hide().appendTo(nav);
		$("<a />").addClass("down").attr("href", "#").html(_options.downText).hide().appendTo(nav);
		return nav;
	}

	/**
	 * Add the HTML for scrolling per group,
	 * but only if there are more thumbnails
	 * than the maximum display per group.
	 * @param {jQuery DOM object} group
	 */
	function addNav(group) {

		var numThumbs = group.find("img").length;
		if (numThumbs <= _options.maxDisplay) {
			return;
		}

		// create nav html (only once)
		if (!_navigation) {
			_navigation = navHtml();
		}

		var parent = group.parent();

		// create navigation html and append to group
		_navigation.appendTo(parent);

		// scroll from previous page
		var scrollNum = getCookie();

		if (scrollNum > 0) {
			parent.find(".up").show();
		}

		if (scrollNum < numThumbs - _options.maxDisplay) {
			parent.find(".down").show();
		}
	}

	/**
	 * Add events for up and down navigation
	 * links if at least one accordion group
	 * has navigation present.
	 */
	function addEvents() {
		if (_navigation) {

			$(".up").on("click", function(e) {
				e.preventDefault();
				navigate($(this), "up");
			});

			$(".down").on("click", function(e) {
				e.preventDefault();
				navigate($(this), "down");
			});
		}
	}

	/**
	 * Navigate thumbs div
	 * @param  {jQuery Object} obj Navigation object
	 * @return null
	 */
	function navigate(obj) {

		var direction = obj.hasClass("up") ? "up" : "down";
		var thumbs = obj.parents(".scroll-nav").parent().find(".thumbs");
		var numThumbs = thumbs.find("a").length;
		var currentMargin = parseInt(thumbs.css("marginTop"), 10);

		var newNum = direction === "up" ? getCookie() - 1 : getCookie() + 1;
		var newMargin = direction === "up" ? currentMargin + _thumbHeight : currentMargin - _thumbHeight;

		setCookie(newNum);

		thumbs.animate({
			marginTop: newMargin
		});

		// show the other nav option
		obj.siblings().show();

		// see if it's time to hide the clicked nav option
		if (direction === "up" && newNum === 0) {
			obj.hide();
		} else if (direction === "down" && newNum === numThumbs - 5){
			obj.hide();
		}
	}

	/**
	 * Find the section of the website
	 * the user is currently in
	 * @return {string}
	 */
	function findSection() {
		var url = document.location.href.split("/");
		return url[3] || null;
	}

	/**
	 * Find the index of the section
	 * the user is currently in.
	 * @return {integer}
	 */
	function findSectionIndex() {
		var sections = _obj.find(_options.header);
		var section = findSection();

		return section ? sections.index($("." + section)) : 0;
	}

	/**
	 * On page load, determine if the
	 * active navigation needs to scroll.
	 * If so, scroll it.
	 * @return null
	 */
	function initialScroll() {
		var newMargin = _thumbHeight * getCookie() * -1;
		var section = $(".ui-accordion-content-active");

		section.find(".thumbs").css({
			marginTop: newMargin
		});
	}

	/**
	 * Reset cookie and all accordion
	 * group margins when a new section
	 * is opened.
	 * @return null
	 */
	function reset() {
		setCookie(0);
		var groups = _obj.find(".thumbs");
		groups.css({
			marginTop: 0
		});
		$(".up").hide();
		$(".down").show();
	}

	/**
	 * Set the scroller cookie value
	 * @param {integer}
	 */
	function setCookie(num) {
		$.cookie("scroller", num, { path: '/' });
	}

	/**
	 * Get the value of the scroller cookie
	 * @param {integer}
	 */
	function getCookie() {
		return parseInt($.cookie("scroller"), 10);
	}

	return {

		/**
		 * Create a scroller!
		 * @param  {jQuery Object} obj
		 * @param  {Object} options
		 * @return null
		 */
		create: function(obj, options) {

			_obj = obj;
			_options = $.extend({}, _defaultOptions, options);

			configureGroups();
			addEvents();

			_obj.accordion({
				header: _options.header,
				active: findSectionIndex(),
				heightStyle: "content",
				activate: function (e, ui) {
					reset();
				}
			});

			initialScroll();
		}

	};

})(jQuery);


(function($){
	$.fn.scroller = function(options) {
		return scroller.create(this, options);
	};
})(jQuery);