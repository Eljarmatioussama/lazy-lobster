<?php

require '../admin/config.php';
require './dbconfig.php';

header('Content-Type: application/json; charset=utf-8');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, array('http://localhost:19006', 'http://localhost:8080'), true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$payload = json_decode(file_get_contents('php://input'), true);
$uid = preg_replace('/[^A-Za-z0-9_-]/', '', (string)($payload['uid'] ?? ''));
$email = filter_var($payload['email'] ?? '', FILTER_VALIDATE_EMAIL);
$name = trim((string)($payload['displayName'] ?? ''));
$photo = trim((string)($payload['photoURL'] ?? ''));

if (!$uid || !$email || strlen($name) > 255 || strlen($photo) > 500) {
    http_response_code(400);
    echo json_encode(array('error' => 'uid and valid email are required'));
    exit;
}

$statement = $DB_con->prepare('INSERT INTO app_users (user_id, email, display_name, photo_url) VALUES (:uid, :email, :name, :photo) ON DUPLICATE KEY UPDATE email = VALUES(email), display_name = VALUES(display_name), photo_url = VALUES(photo_url)');
$statement->execute(array(':uid' => $uid, ':email' => $email, ':name' => $name, ':photo' => $photo ?: null));
echo json_encode(array('success' => true, 'user_id' => $uid));
