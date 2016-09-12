var do_initialize_gmap = function(elt) {
	var latlng = new google.maps.LatLng(50.627557,3.052719);
	var options = {
		draggable: true,
		mapTypeControl: true,
		navigationControl: true,
		scaleControl: false,
		scrollwheel: false,
		center: latlng,
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map($(elt).get(0), options);
	var mark = new google.maps.Marker({
		position: latlng,
		map: map,
		title: "Mon Bar a Couture",
/* 		animation: google.maps.Animation.BOUNCE, */
	});
}

var do_add_contact = function(elt) {
	var field = elt.siblings('.mail-field');
	var form = elt.parent();
	var container = form.parent();
	var addr = field.val();
	
	container.find('.error').remove();
	
	var re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

	form.find('p').remove();
	
	if (re.test(addr)) {
		$.post('mailjet.php', { contact: field.val() }, function() {
			form.find('.mail-button').remove();
			form.append('<p class="centered" style="font-size: larger;">Merci !</p>');
		});
	} else {
		form.append('<p class="centered" style="color: red; font-size: smaller;">Adresse mail non valide !</p>');
		$(field).attr('value', 'Votre adresse mail...');
	}
}

var do_send_mail = function(elt) {
	var container = elt.parent().parent().parent().parent().parent().parent();
	var form = $('form', container);
	var name=$('input[name="name"]', form).val();	
	var addr=$('input[name="mail"]', form).val();
	var subj=$('input[name="subject"]', form).val();
	var mesg=$('textarea[name="text"]', form).val();

	container.find('.error').remove();
	container.find('.notify').remove();
	
	var re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
	
	

	
	if (! (name.length && addr.length && mesg.length)) {
		container.append("<p class='error' style='color: red; font-size: smaller; font-style: italic; font-weight: bold; text-align: center;'>Les champs marqu&eacute;s d'une &eacute;toile sont obligatoires.</p>");
		return;
	} 
	
	if (! re.test(addr)) {
		container.append("<p class='error' style='color: red; font-size: smaller; font-style: italic; font-weight: bold; text-align: center;'>Adresse mail non valide.</p>");
		return;
	}

	$('input[id!="submit"]', form).val('');
	$('textarea', form).val('');
	
	$.post('mail.php', { from: addr, name: name, subject:  subj, message: mesg }, function() {
		container.append("<p class='notify' style='font-size: smaller; font-style: italic; font-weight: bold; text-align: center;'>Votre message a bien &eacute;t&eacute; envoy&eacute;, merci.</p>");
	});
}

function noenter() {
	return !(window.event && window.event.keyCode == 13); 
}
