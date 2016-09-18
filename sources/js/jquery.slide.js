(function($) {
	$.fn.slideInLeft = function(speed) {
		$(this).stop().show().css({ opacity: '0' }).css({ left: -$(this).width() }).animate({ left: '0', opacity: '1' }, speed);
		return this;
	};
	$.fn.slideOutLeft = function(speed) {
		$(this).stop().animate({ left: -$(this).width(), opacity: '0' }, speed);
		return this;
	};
	$.fn.slideInRight = function(speed) {
		$(this).stop().show().css({ opacity: '0' }).css({ right: -$(this).width() }).animate({ right: '0', opacity: '1' }, speed);
		return this;
	};
	$.fn.slideOutRight = function(speed) {
		$(this).stop().animate({ right: -$(this).width(), opacity: '0' }, speed);
		return this;
	};
})(jQuery);