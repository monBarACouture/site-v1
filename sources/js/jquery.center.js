(function($) {	
	$.fn.centerH = function() {
		var elt=$(this);
		elt.find('img').add(elt).each(function(index, e) {
			if ($(e).is('img')) {
				$(e).load(function() {
					elt.css('margin-left', (elt.parent().width()-elt.width())/2);
				});
			} else {
				elt.css('margin-left', (elt.parent().width()-elt.width())/2);				
			}
		});
		return this;
	};
	$.fn.centerV = function() {
		var elt=$(this);
		elt.find('img').add(elt).each(function(index, e) {
			if ($(e).is('img')) {
				$(e).load(function() {
					$(this).css('margin-top', ($(this).parent().height()-$(this).height())/2);
				});
			} else {
				elt.css('margin-top', (elt.parent().height()-elt.height())/2);
			}			
		});
		return this;
	};
	$.fn.center  = function() {
		$(this).centerH().centerV();
		return this;
	};
})(jQuery);
