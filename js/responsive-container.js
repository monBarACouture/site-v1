var init_responsive_box = function() {
	switch ($('html').css('font-family')) {
	case 'large':
	case 'medium':
		$('.row').each(function() {
			var spans = $('.span1,.span2,.span3,.span4,.span5,.span6,.span7,.span8,.span9,.span10,.span11,.span12', $(this)).not('.unresizable');
			var max_height = 0;
						
			spans.each(function() {
				$('.box', $(this)).removeAttr('style').each(function() {
					max_height = Math.max($(this).height(), max_height);
				});
			});
			spans.each(function() {
				$('.box', $(this)).css('min-height', max_height);
			});	
		});
		break;
	case 'thin':
		$('.row').each(function() {
			$('.span1,.span2,.span3,.span4,.span5,.span6,.span7,.span8,.span9,.span10,.span11,.span12').each(function() {
				$(this).find('.box').removeAttr('style');
			});	
		});	
		break;
	}
}

$(window).load(function() {
	init_responsive_box();
	$(window).resize(function() {
		init_responsive_box();
	});
});
