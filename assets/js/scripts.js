$(document).ready(function() {
	
	//accordion initialization
	$("#nav").accordion({
		header: "h2", 
		duration: 750,
		autoHeight: false,
		navigation: true,
		change: function(event, ui) {
			scrollSetup();
		}
	});
	
	
	//reset cookie when new section is opened
	$("h2").click(function() {
		$.cookie('scroll', 0, { path: '/' });
	});
	
	
	//scroll button animations
	function fadeOut(object) {
		$(object).animate({"color" : "#000"}).css({ "cursor" : "default" });
	}
	
	function fadeIn(object) {
		$(object).animate({"color" : "#fff"}).css({ "cursor" : "pointer" });
	}
	
	
	
	
	
	//finds the section on subpages
	var url = document.location.href;
	var url = url.split("/")
	var section = url[3];
	
	
	//show the correct section on subpages
	if(section) {
		$('#nav').accordion('activate', 'h2#' + section);
		scrollSetup();
		//set the height
		$("div .page_width").css({"display" : "block"});
	} else {
		$('#nav').accordion('activate', 'h2:first');
		$.cookie('scroll', '0', { path: '/' });
		//set the height
		$("div .page_width").css({"display" : "block"});
	}
	
	//controls scroll initialization
	function scrollSetup() {
		
		$("div.ui-accordion-content:not(.ui-accordion-content-active) div.thumbs").css({"margin-top" : 0});
		
		if($.cookie('scroll') != 0) {
			number = $.cookie('scroll');
			distance = -(number * 49);
			$("div.ui-accordion-content-active div.thumbs").css({"margin-top" : distance});
		} else {
			number = 0;
			$("div.ui-accordion-content-active div.thumbs").css({"margin-top" : 0});
		}
		
		max = ($("div.ui-accordion-content-active div.thumbs img").size()) - 5;
		//fadeIn(".down");
		
		if ( number == 0 ) {
			$(".up").css({"color" : "#000", "cursor" : "default"});
		} else {
			$(".up").css({"color" : "#fff", "cursor" : "pointer"});
		}
		
		if (number == max) {
			$(".down").css({"color" : "#000", "cursor" : "default"});
		} else {
			$(".down").css({"color" : "#fff", "cursor" : "pointer"});
		}
		
	}
	
	//controls the scrolling of thumbs
	$(".down").click(function () {
		
		if ( number < max ) {
			$("div.ui-accordion-content-active div.thumbs").animate({"margin-top": "-=49px"}, 500);
			number++;
		}
		
		if ( number == max) {
			fadeOut(".down");
		}
		
		if ( number > 0 ) {
			fadeIn(".up");
		}
		$.cookie('scroll', number, { path: '/' });
		
    });
    
    $(".up").click(function () {
		
		if ( (number <= max) && (number > 0) ) {
			$("div.ui-accordion-content-active div.thumbs").animate({"margin-top": "+=49px"}, 500);
			number--;
		}
		
		if ( number != max ) {
			fadeIn(".down");
		}
		
		if ( number == 0 ) {
			fadeOut(".up");
		}
		$.cookie('scroll', number, { path: '/' });
		
    });
	
});