<?php

include_once('mailjet-auth.php');
include_once('php-mailjet.class-mailjet-0.1.php');

$contact = $_REQUEST['contact'];

# Parameters
$params = array(
	'method' => 'POST',
	'contact' => $contact,
	'id' => '153992'
);

// Create a new Object
$mj = new Mailjet($mailjetAPIKey, $mailjetAPISecretKey);

# Call
$response = $mj->listsAddContact($params);
error_log($response);

# Result
$contact_id = $response->contact_id;
?>
