(function($) {	
	var _scroll_left = function(gallery, thumb_container) {
		var index = gallery.data('index'), shift = gallery.data('shift'), width = gallery.data('width');
		if (index < gallery.data('count') && (width-shift) > thumb_container.width()  ) {
			var offset = $(thumb_container.children()[index]).outerWidth(true);
			thumb_container.children().animate({left: "-=" + offset}, 'fast');
			gallery.data('index', index+1);
			gallery.data('shift', shift+offset);
			return true;
		}
		return false;
	}
	
	var _can_scroll_right = function(gallery, thumb_container) {
		var index = gallery.data('index'), 
			shift = gallery.data('shift'),
			width = gallery.data('width');
			offset = $(thumb_container.children()[index-1]).outerWidth(true);
		return (index > 0) && ((width-shift+offset) < gallery.width());
	}
	
	var _scroll_right = function(gallery, thumb_container) {
		var index = gallery.data('index'), shift = gallery.data('shift');
		if (index > 0) {
			var offset = $(thumb_container.children()[index-1]).outerWidth(true);
			thumb_container.children().animate({left: "+=" + offset}, 'fast');
			gallery.data('index', index-1);
			gallery.data('shift', shift-offset);
			return true;
		}
		return false;
	}
	
	var _load = function(gallery, thumbnails, count, width) {
		if (thumbnails.length > 0) {
			var thumb = $(thumbnails[0]);
			var thumb_container = thumb.parent();
			var thumb_height = thumb_container.height();
			var img = thumb.children();
			if (img.prop('complete')) {
				// the image has already been loaded (it is in the cache)
				thumb.css('left', width);
				img.fitH().center();
				_load(gallery, thumbnails.slice(1), count + 1, width + thumb.outerWidth(true));
			} else {
				img.attr("src", img.attr("src") + "?" + new Date().getTime());
				img.load(function() {
					// the image has not been loaded
					_load(gallery, thumbnails, count, width);
				});
			}
		} else {
			gallery.data('count', count);
			gallery.data('width', width);
			gallery.data('index', 0);
			gallery.data('shift', 0);
			gallery.data('gallery-width', gallery.width());
			
			var thumb_container = $('.thumbnails', gallery);
			
			$('.thumbnails-controls', gallery).children()
				.filter('.prev').click(function(evt) {
					if (evt.preventDefault) {
						evt.preventDefault();
					} else {
						evt.returnValue = false;
					}
					_scroll_right(gallery, thumb_container);
				}).end()
				.filter('.next').click(function(evt) {
					if (evt.preventDefault) {
						evt.preventDefault();
					} else {
						evt.returnValue = false;
					}
					_scroll_left(gallery, thumb_container);
				}).end();
			
			if (gallery.data('width') < gallery.width()) {
				$('.thumbnails-controls', gallery).hide();
				thumb_container.css({margin: '0 auto', width: gallery.data('width') });
			}
			
			$(window).resize(function() {
				var w = gallery.width();
				
				if (gallery.data('gallery-width') < w) {
					// gallery grown
					while (_can_scroll_right(gallery, thumb_container)) {
						_scroll_right(gallery, thumb_container) ;						
					}
					if (gallery.data('width') <= gallery.width()) {
						$('.thumbnails-controls', gallery).hide();
						thumb_container.css({margin: '0 auto', width: gallery.data('width') });
					}
				} else {
					// gallery shrink
					if (gallery.data('width') > gallery.width()) {
						$('.thumbnails-controls', gallery).show();
						thumb_container.css({margin: '0', width: '100%' });
					} 
				}
				gallery.data('gallery-width', w);
			});
			
			$('.thumbnails-progress', gallery).remove();
		}
	};
	
	$.fn.init_gallery = function(height) {
		var gallery=$(this);
		var thumbnails = $('.thumbnails', gallery);		
		
		thumbnails.height(height);
		
		gallery.append(
			"<div class='thumbnails-controls'>"
			+ "<a class='prev' href='#'></a>"
			+ "<a class='next' href='#'></a>"
			+ "<div>");
		
		
		
		gallery.append("<div class='thumbnails-progress'>"
						+ "<img src='css/img/progress.gif' style='vertical-align: middle; margin: 0;'>"
						+ "</div>");
		
		$('.thumbnails-progress', gallery).width('100%').height(height).find('img').center();
				
		_load(gallery, thumbnails.children().toArray(), 0, 0);
		return this;
	};
})(jQuery);
