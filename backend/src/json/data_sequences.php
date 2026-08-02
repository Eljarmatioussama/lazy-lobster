<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require './app_core.php';

$conditions = array();
$params = array();

if (isset($_GET['category']) && $_GET['category'] !== '') {
    $conditions[] = 'category = :category';
    $params[':category'] = $_GET['category'];
}

if (isset($_GET['difficulty']) && $_GET['difficulty'] !== '') {
    $difficulty = filter_var($_GET['difficulty'], FILTER_VALIDATE_INT);
    if ($difficulty === false || $difficulty < 1 || $difficulty > 5) {
        http_response_code(400);
        echo json_encode(array('error' => 'difficulty must be an integer from 1 to 5'));
        exit;
    }
    $conditions[] = 'difficulty = :difficulty';
    $params[':difficulty'] = $difficulty;
}

$limit = 20;
if (isset($_GET['limit']) && $_GET['limit'] !== '') {
    $limit = filter_var($_GET['limit'], FILTER_VALIDATE_INT);
    if ($limit === false || $limit < 1 || $limit > 100) {
        http_response_code(400);
        echo json_encode(array('error' => 'limit must be between 1 and 100'));
        exit;
    }
}

$sql = 'SELECT sequence_id, sequence_title, sequence_description, category, difficulty, total_duration, peak_pose_id, image_url, created_at, updated_at FROM sequences';
if ($conditions) $sql .= ' WHERE ' . implode(' AND ', $conditions);
$sql .= ' ORDER BY sequence_id DESC LIMIT ' . (int) $limit;

$statement = $connect->prepare($sql);
$statement->execute($params);
echo json_encode($statement->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
