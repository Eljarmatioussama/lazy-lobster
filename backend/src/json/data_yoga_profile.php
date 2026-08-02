<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require './app_core.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$json = json_decode(file_get_contents('php://input'), true);
$input = is_array($json) ? array_merge($_POST, $json) : $_POST;
$userId = isset($_GET['user_id']) ? $_GET['user_id'] : (isset($input['user_id']) ? $input['user_id'] : '');

if (!$userId || strlen($userId) > 128) {
    http_response_code(400);
    echo json_encode(array('error' => 'valid user_id is required'));
    exit;
}

function yogaJsonValue($value) {
    if (is_array($value)) return json_encode($value, JSON_UNESCAPED_UNICODE);
    if ($value === null || $value === '') return null;
    $decoded = json_decode($value, true);
    return json_last_error() === JSON_ERROR_NONE ? json_encode($decoded, JSON_UNESCAPED_UNICODE) : json_encode(array($value));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = $connect->prepare('SELECT * FROM user_yoga_profile WHERE user_id = :user_id');
    $statement->execute(array(':user_id' => $userId));
    $profile = $statement->fetch(PDO::FETCH_ASSOC);
    if (!$profile) {
        http_response_code(404);
        echo json_encode(array('error' => 'profile not found'));
        exit;
    }
    foreach (array('tight_zones', 'injuries') as $field) {
        $profile[$field] = $profile[$field] ? json_decode($profile[$field], true) : array();
    }
    echo json_encode($profile, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('error' => 'method not allowed'));
    exit;
}

$fields = array(
    'display_name', 'age', 'gender', 'experience_level', 'yoga_goal', 'preferred_style',
    'daily_commitment_minutes', 'flexibility_score', 'tight_zones', 'injuries'
);
$values = array(':user_id' => $userId);
$columns = array('user_id');
$placeholders = array(':user_id');
$updates = array();

foreach ($fields as $field) {
    if (!array_key_exists($field, $input)) continue;
    $columns[] = $field;
    $placeholders[] = ':' . $field;
    $values[':' . $field] = in_array($field, array('tight_zones', 'injuries'), true) ? yogaJsonValue($input[$field]) : $input[$field];
    $updates[] = $field . ' = VALUES(' . $field . ')';
}

if (count($columns) === 1) {
    http_response_code(400);
    echo json_encode(array('error' => 'profile fields are required'));
    exit;
}

$sql = 'INSERT INTO user_yoga_profile (' . implode(', ', $columns) . ') VALUES (' . implode(', ', $placeholders) . ') ON DUPLICATE KEY UPDATE ' . implode(', ', $updates);
$statement = $connect->prepare($sql);
$statement->execute($values);

$read = $connect->prepare('SELECT * FROM user_yoga_profile WHERE user_id = :user_id');
$read->execute(array(':user_id' => $userId));
$profile = $read->fetch(PDO::FETCH_ASSOC);
foreach (array('tight_zones', 'injuries') as $field) {
    $profile[$field] = $profile[$field] ? json_decode($profile[$field], true) : array();
}
echo json_encode($profile, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
