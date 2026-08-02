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

if (isset($_GET['target']) && $_GET['target'] !== '') {
    $conditions[] = 'JSON_SEARCH(target_areas, \'one\', :target) IS NOT NULL';
    $params[':target'] = $_GET['target'];
}

$sql = 'SELECT pose_id, pose_name, sanskrit_name, category, difficulty, image_url, target_areas FROM poses';
if ($conditions) $sql .= ' WHERE ' . implode(' AND ', $conditions);
$sql .= ' ORDER BY category, difficulty, pose_name';

$statement = $connect->prepare($sql);
$statement->execute($params);
$rows = $statement->fetchAll(PDO::FETCH_ASSOC);

foreach ($rows as &$row) {
    $row['target_areas'] = $row['target_areas'] ? json_decode($row['target_areas'], true) : array();
}

echo json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
