(function($) {
	$.fn.fit = function(rect) {	
		var w, h;
				
		if (rect) {
			w = rect.width;
			h = rect.height;
		} else {		
			w = $(this).parent().width();
			h = $(this).parent().height();
		}
		
		var ratio = $(this).width()/$(this).height();
		
		if (w >= h*ratio) {
			$(this).width(w).height(Math.round(w/ratio));
		} else {
			$(this).height(h).width(Math.round(h*ratio));
		}
		
		return this;
	};
	
	$.fn.fitH = function(rect) {
		var w, h;
		
		if (rect) {
			w = rect.width;
			h = rect.height;
		} else {
			w = $(this).parent().width();
			h = $(this).parent().height();
		}
		
		var ratio = $(this).width()/$(this).height();
		$(this).width(w).height(Math.round(w/ratio)).show();
				
		return this;		
	}
	
})(jQuery);

$(window).load(function() {
	$('.fit').removeAttr('style').fit();
	$(window).resize(function() {
		$('.fit').removeAttr('style').fit();
	});
});