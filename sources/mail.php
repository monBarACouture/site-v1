<?php
define('MAIL_PATTERN', '/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i');
// define('MAIL_RECIPIENT', 'contact@catherine-kong.com');
// define('MAIL_RECIPIENT', 'contact@nealrame.com');
define('MAIL_RECIPIENT', 'contact@monbaracouture.com');
define('MAIL_ERROR_RECIPIENT', 'contact@nealrame.com');

function check_parameters() {
	$addr = $_POST['from'];
	$name = $_POST['name'];
	return (preg_match(MAIL_PATTERN, $addr) == 1)
			&& (preg_filter(array('/\r\n/', '/\r/', '/\n/'), '', $name) == NULL);
}

if (isset($_POST['from'])
		&& isset($_POST['name'])
		&& isset($_POST['subject'])
		&& isset($_POST['message'])) {
	if (check_parameters()) {
		$from = $_POST['from'];
		$name = $_POST['name'];
		$subject = $_POST['subject'];
		$message = $_POST['message'];
		$headers =
			"From: $name <$from>"
			. "\r\n" . "Reply-To: $from"
			. "\r\n" . "X-Mailer: PHP/" . phpversion();
		mail(MAIL_RECIPIENT, $subject, $message, $headers);
	} else {
		mail(MAIL_ERROR_RECIPIENT, 'MBaC contact error', var_export($_POST, true));
		header("HTTP/1.0 400 Bad Request");
	}
} else {
	header("HTTP/1.0 400 Bad Request");
}
