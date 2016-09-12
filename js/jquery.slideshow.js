(function($) {
	$.fn.start_slideshow = function(width, height, options) {
	
		var defaults_options = {
			controls: 1,             // [0 = off, 1 = on]
			transition_speed: '500', // transition speed between slides
			timeout: 5000,           // transition timeout in milliseconds
			slideshow: 1             // [0 = off, 1 = on]
		};

		var _init = function() {
			var slides = $('.slide', slideshow_container);			
			var count = slides.length;
			
			// slideshow_container initialization
			slideshow_container.data('settings', settings);
			slideshow_container.data('slides_count', count);
			slideshow_container.data('current_slide_index', -1);
			slideshow_container.data('slideshow', (settings.slideshow));
			
			var w = slideshow_container.parent().width();
			
			slideshow_container.width(w);
			slideshow_container.height(w*(height/width));
			
			slideshow_container.css({position: 'relative', overflow: 'hidden'});
			
			// Loader initialization
			slideshow_container.append(
				'<div id="progress_container" style="background-color: #000; overflow: hidden; z-index: 100; position: absolute;">'
					+ '<img src="css/img/progress.gif" style="vertical-align: middle; margin: 0;">'
					+ '</div>');
			
			// Controls initialization
			if (settings.controls && slides.length > 1) {
				slideshow_container.append('<a class="control prev" href="#">&lsaquo;</a>');
				slideshow_container.append('<a class="control next" href="#">&rsaquo;</a>');
				$('.control', slideshow_container).css({ zIndex: '75' }).centerV();
			}

			$('#progress_container', slideshow_container).stretch().find('img').center();
			
			_load(slides.toArray());
		};

		var _load = function(slides) {
			if (slides.length > 0) {
				var slide = slides.pop();
				var img = $('img', $(slide));				
				$(slide).css({ display: 'none', zIndex: '25' });
				if (img.prop('complete')) {
					img.fit();
					_load(slides);
				} else {
					img.attr("src", img.attr("src") + "?" + new Date().getTime());
					img.load(function() {
						img.fit();
						_load(slides);
					});
				}
			} else {
				_start();
			}
		};
		
		var _start = function() {
			var control_prev = $('.control.prev', slideshow_container);
			var control_next = $('.control.next', slideshow_container);
			slideshow_container.find('#progress_container').fadeOut('slow', function() {
				control_prev.slideOutLeft('fast');
				control_next.slideOutRight('fast');
				slideshow_container.hover(
					function(){
						control_prev.slideInLeft('fast');
						control_next.slideInRight('fast');
					}, 
					function() {
						control_prev.slideOutLeft('fast');
						control_next.slideOutRight('fast');
					}
				);
			});
			
			var index=0
			var slide = _getSlide(index);
			
			slideshow_container.data('current_slide_index', index);
			$(slide).css({ display: 'block', zIndex: '50' });
			
			$(window).resize(function() {
				_resize();
			});
						
			_start_timer();
			_enable_controls();
		};
		
		var _switch = function(curr_index, next_index) {		
			if (curr_index != next_index) {
				_stop_timer();
				_disable_controls();
				
				var curr_slide = _getSlide(curr_index);
				var next_slide = _getSlide(next_index);
																
				$(next_slide).css({ display: 'block' });
				
				$(curr_slide).fadeOut('slow', function() {
					$(next_slide).css({ zIndex: '50' });
					$(curr_slide).css({ zIndex: '25' });	
					slideshow_container.data('current_slide_index', next_index);
					_enable_controls();
					_start_timer();
				});
			}
		};
		
		var _prev = function() {
			var curr_index = slideshow_container.data('current_slide_index');
			var count = slideshow_container.data('slides_count');
			_switch(curr_index, (curr_index - 1 + count)%count);
		};

		var _next = function() {
			var curr_index = slideshow_container.data('current_slide_index');
			var count = slideshow_container.data('slides_count');
			_switch(curr_index, (curr_index + 1)%count);
		};
		
		var _getSlide = function(index) {
			return slideshow_container.find('.slide').get(index);
		};
		
		var _enable_controls = function() {
			$('.control.prev', slideshow_container).click(function(event) {
				event.preventDefault();
				_prev();
			});
			$('.control.next', slideshow_container).click(function(event) {
				event.preventDefault();
				_next();
			});
		};
		
		var _disable_controls = function() {
			$('.control', slideshow_container).unbind('click').click(function(event) {
				event.preventDefault();
			});
		};
				
		var _start_timer = function() {
			if (settings.slideshow) {
				slideshow_container.data('timerref', window.setTimeout(function() { _next(); }, settings.timeout));
			}
		};
		
		var _stop_timer = function() {
			window.clearTimeout(slideshow_container.data('timerref'));
		};
		
		var _resize = function() {
			var w = slideshow_container.parent().width();
			slideshow_container.width(w);
			slideshow_container.height(w*(height/width));
			$('.slide', slideshow_container).find('img').fit();
			$('.control', slideshow_container).css({ zIndex: '75' }).centerV();
		}
				
		var settings = $.extend({}, defaults_options, options);
		var slideshow_container = $(this);
		
		/* Place element
		 ---------------------------------------------------------------------------*/
		_init();
	}
})(jQuery);
