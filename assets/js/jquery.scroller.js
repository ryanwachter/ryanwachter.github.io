/**
 * @codekit-prepend "jquery.js", "jquery.accordion.js", "jquery.cookie.js";
 */
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

		return section ? sections.index($("." + section)) : 0;
	}

	return {

		create: function(obj) {

			_obj = obj;

			obj.accordion({
				header: _header,
				active: findSectionIndex(),
				heightStyle: "content"
			});
			
		}

	};

})(jQuery);


(function($){
	$.fn.scroller = function() {
		return scroller.create(this);
	};
})(jQuery);