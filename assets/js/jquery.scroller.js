/**
 * @codekit-prepend "vendor/jquery.js", "vendor/jquery.accordion.js", "vendor/jquery.cookie.js";
 */

var scroller = (function($) {

	/**
	 * Menu Object
	 * @type {jQuery object}
	 */
	var _obj;

	/**
	 * Default options
	 * @type {Object}
	 */
	var _defaultOptions = {
		maxDisplay: 5,
		upText: "up",
		downText: "down",
		header: "h2"
	};

	/**
	 * Passing in options extended
	 * from the default options.
	 * @type {Object}
	 */
	var _userOptions = {};

	var _thumbHeight;

	/**
	 * Is there thumb navigation on the page?
	 * @type {Boolean}
	 */
	var _navigation = false;

	function setGroups() {
		var groups = _obj.find(".thumbs");

		// find height of the thumbs
		_thumbHeight = groups.first().find("img").first().outerHeight(true);

		// wrap thumbs in a container that we set the height of
		// so we can scroll thumbs up.
		groups.wrap("<div class='thumbs_container' />");

		var containers = _obj.find(".thumbs_container");

		// set height of thumbs_container
		var groupHeight = _thumbHeight * _userOptions.maxDisplay;
		containers.css({
			height: groupHeight,
			overflow: "hidden"
		});

		$.each(containers, function(i) {
			addGroupNav($(this));
		});
		
	}

	/**
	 * Create navigation HTML
	 * @return {object} jQuery DOM object
	 */
	function navHtml() {
		var nav = $("<div />").addClass("scroll-nav");
		$("<div />").addClass("up").html("<a href='#'>" + _userOptions.upText + "</a>").hide().appendTo(nav);
		$("<div />").addClass("down").html("<a href='#'>" + _userOptions.downText + "</a>").hide().appendTo(nav);
		return nav;
	}

	function addGroupNav(group) {

		var numThumbs = group.find("img").length;
		if (numThumbs <= _userOptions.maxDisplay) {
			return;
		}

		// navigation is present
		_navigation = true;

		var scrollNum = getCookie();
		var parent = group.parent();

		navHtml().appendTo(parent);

		if (scrollNum > 0) {
			parent.find(".up").show();
		}

		if (scrollNum < numThumbs) {
			parent.find(".down").show();
		}
	}

	function addEvents() {
		if (_navigation) {

			$(".up").on("click", function(e) {

				var newNum = getCookie() - 1;
				setCookie(newNum);

				var nav = $(this).parents(".scroll-nav");
				var thumbs = nav.parent().find(".thumbs");
				var numThumbs = thumbs.find("a").length;

				var newMargin = parseInt(thumbs.css("marginTop"), 10) + _thumbHeight;
				thumbs.css({
					marginTop: newMargin
				});

				nav.find(".down").show();

				if (newNum === 0) {
					$(this).hide();
				}
			});

			$(".down").on("click", function(e) {

				var newNum = getCookie() + 1;
				setCookie(newNum);

				var nav = $(this).parents(".scroll-nav");
				var thumbs = nav.parent().find(".thumbs");
				var numThumbs = thumbs.find("a").length;

				var newMargin = parseInt(thumbs.css("marginTop"), 10) - _thumbHeight;
				thumbs.css({
					marginTop: newMargin
				});

				nav.find(".up").show();

				if (newNum === numThumbs - 5) {
					$(this).hide();
				}
			});
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
		var sections = _obj.find(_userOptions.header);
		var section = findSection();

		return section ? sections.index($("." + section)) : 0;
	}

	function setCookie(num) {
		$.cookie("scroller", num, { path: '/' });
	}

	function getCookie() {
		return parseInt($.cookie("scroller"), 10);
	}

	return {

		create: function(obj, options) {

			setCookie(0);

			_obj = obj;
			_userOptions = $.extend({}, _defaultOptions, options);

			setGroups();
			addEvents();

			_obj.accordion({
				header: _userOptions.header,
				active: findSectionIndex(),
				heightStyle: "content",
				activate: function (e, ui) {
					setCookie(0);
				}
			});
			
		}

	};

})(jQuery);


(function($){
	$.fn.scroller = function(options) {
		return scroller.create(this, options);
	};
})(jQuery);