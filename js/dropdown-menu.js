var init_dropdown_menu = function() {
	$('#navbar').children('li').each(function() {
		var dropdown = $('.dropdown', $(this));
		if (dropdown.length > 0) {
			if ($('html').css('font-family') != 'thin') {
				$(this).unbind();
				dropdown.removeAttr('style');
				$(this).hover(
					function() { dropdown.stop().slideDown('fast'); },
					function() { dropdown.stop().slideUp('fast'); }
				);
			} else {
				dropdown.removeAttr('style');
				$(this).unbind();
			}
		}
	});
}

$(document).ready(function() {
	init_dropdown_menu();
	$(window).resize(function() {
		init_dropdown_menu();
	});
});
