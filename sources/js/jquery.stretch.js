(function($) {	
	$.fn.stretch = function(options) {		
		$(this).width($(this).parent().width());
		$(this).height($(this).parent().height());	
		$(this).center();
		return this;
	};
})(jQuery);
