<?php

header('Content-Type: application/json; charset=utf-8');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, array('http://localhost:19006', 'http://localhost:8080'), true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_FILES['profile']) || empty($_POST['user_id'])) {
    http_response_code(400);
    echo json_encode(array('error' => 'profile image and user_id are required'));
    exit;
}

$userId = preg_replace('/[^A-Za-z0-9_-]/', '', (string) $_POST['user_id']);
$file = $_FILES['profile'];
$allowed = array('image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp');
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);

if ($file['error'] !== UPLOAD_ERR_OK || !$userId || $file['size'] > 5 * 1024 * 1024 || !isset($allowed[$mime])) {
    http_response_code(400);
    echo json_encode(array('error' => 'invalid image; use JPG, PNG, or WebP under 5MB'));
    exit;
}

$filename = 'profile_' . $userId . '.' . $allowed[$mime];
$destination = __DIR__ . '/../images/' . $filename;
if (!move_uploaded_file($file['tmp_name'], $destination)) {
    http_response_code(500);
    echo json_encode(array('error' => 'could not save image'));
    exit;
}

echo json_encode(array('url' => 'http://localhost:8080/images/' . $filename));
