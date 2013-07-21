var scroller = (function($) {

	/**
	 * Menu Object
	 * @type {jQuery object}
	 */
	var _obj;

	/**
	 * Selector to use as the
	 * headers on the menu object
	 * @type {String}
	 */
	var _header = "h2";

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
		var sections = _obj.find(_header);
		var section = findSection();

		return section ? sections.index($("#" + section)) : 0;
	}

	function setCookie(num) {
		$.cookie("scroller", num, { path: "/" });
	}

	function getCookie() {
		return parseInt($.cookie("scroller"));
	}

	function moveThumbs(obj) {
		var target = $(obj).siblings(".thumbs_container").find(".thumbs");
		console.log(target);
	}

	function setupEvents() {

		$(".down").on("click", function () {
			setCookie(getCookie() + 1);
			moveThumbs(this);

			// move the thumbnails
			// manage display of "scroll up" and "scroll down"
		
		});
	    
	    $(".up").on("click", function () {	
			setCookie(getCookie() - 1);
			moveThumbs(this);
		});
	}

	return {

		create: function(obj) {

			_obj = obj;

			obj.accordion({
				header: _header,
				active: findSectionIndex(),
				heightStyle: "content",
				beforeActivate: function (event, ui) {
					setCookie(0);
					console.log(getCookie());
				}
			});

			setupEvents();
			
		}

	};

})(jQuery);


(function($){
	$.fn.scroller = function() {
		return scroller.create(this);
	};
})(jQuery);