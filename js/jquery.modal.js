(function($) {
	var _setModalContent = function(content_wrapper) {
		var content = content_wrapper.find('figure');
		var img = content.find('img');
		
		content_wrapper.removeAttr('style');
		
		if (img.prop('complete')) {
			content_wrapper
				.width(Math.min(content_wrapper.width(), img.width()+4))
				.height(Math.min(content_wrapper.height(), img.height()))
				.center();
		} else {
			img.load(function() {
				content_wrapper
					.width(Math.min(content_wrapper.width(), $(this).width()+4))
					.height(Math.min(content_wrapper.height(), $(this).height()))
					.center();
			});
		}
	};

	$.fn.run_modal_dialog = function() {
		var dialog = $(this);
		dialog.append('<a class="modal-button-hide" href="#">&times;</a>');
		$('.modal-button-hide', dialog).click(function() {
			$(this).parent().parent().fadeOut('fast').children().slideUp('fast');
		});
		$(this).center();
	}
	
	$.fn.run_modal_figure = function() {
		var figure = $(this);
		
		figure.parent().click(function() {
			$(this).fadeOut('fast').children().slideUp('fast');
		});
		
		figure.children().hide();
		figure.stop().fadeIn('fast', function() {
			figure.children().show();
			
			var image = $(this).find('img');
			if (image.prop('complete')) {
				var win_width  = $(window).width(),
					win_height = $(window).height(),
					max_width  = 0.95*win_width, 
					max_height = 0.95*win_height,
					img_width  = image.width(), 
					img_height = image.height();
					
					switch ($('html').css('font-family')) {
						case 'thin':
							image.fitH({ width: win_width, height: win_height });
							figure.centerV();
							break;
						default:
							if (img_width > max_width || img_height > max_height) {
								image.fitH({ width: max_width, height: max_height });
							}
							figure.width(image.width()).height(image.height()).center();
							break;
					}
			} else {
				image.attr("src", image.attr("src") + "?" + new Date().getTime());
				image.load(function() {
					figure.run_modal_figure();
				});
			}
		});
	}
	
	$.fn.init_modal = function() {
		for (var i=0; i<this.length; i++) {
			var button = $(this[i]);
			var target = '.modal' + button.attr('href');
						
			button.click(function(event) {
				if (event.preventDefault) {
					event.preventDefault();
				} else {
					event.returnValue = false;
				}
				
				var modal = $('.modal' + $(this).attr('href'));
				var modal_content = modal.children();

				modal_content.hide();
				
				modal
					.stop()
					.width($(window).width())
					.height($(window).height())
					.fadeIn('fast', function() {
					modal_content
						.show()
						.filter('figure').each(function() {
							$(this).run_modal_figure();
						}).end()
						.filter('form').each(function() {
							$(this).run_modal_dialog();						
						});
				});
				
/*
				$(window).resize(function() {
					_setModalContent(content_wrapper);
				});
*/
				
			});
		};
		return this;
	};
})(jQuery);

$(document).ready(function() { $('.modal-button-show').init_modal(); });