<?php

/* URL PROJECT */

// Loaded via auto_prepend_file, so controllers re-requiring this file must not redefine.
if (!defined('SITE_URL')) {
    define('SITE_URL', 'http://localhost:8080');
}


/* DATABASE CONFIGURATION */

$database = array(
    'host' => 'db',
    'db'   => 'my_database',
    'user' => 'appuser',
    'pass' => 'password'
);


$email_config = array(
    'email_address' => 'YOUR_EMAIL',
    'email_password' => 'YOUR_PASSWORD',
    'email_subject' => 'YOUR_SUBJECT',
    'email_name' => 'YOUR_NAME',
    'smtp_host' => 'YOUR_SMTP_HOST',
    'smtp_port' => '587',
    'smtp_encrypt' => 'tls'
);


$items_config = array(
    'items_per_page' => '8',
    'images_folder' => 'images/'
);


/* SECURITY CONFIGURATION */

// Captcha requires the PHP gd extension to render its image.
$security_config = array(
    'captcha_enabled' => false
);
