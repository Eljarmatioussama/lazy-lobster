<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require './app_core.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?: [];
$uid = trim((string)($method === 'GET' ? ($_GET['uid'] ?? '') : ($input['uid'] ?? '')));
$exerciseId = (int)($method === 'GET' ? ($_GET['exercise_id'] ?? 0) : ($input['exercise_id'] ?? 0));

if ($uid === '' || $exerciseId < 1) { http_response_code(400); echo json_encode(['error' => 'uid and exercise_id are required']); exit; }

if ($method === 'POST') {
  $percent = max(0, min(100, (int)($input['progress'] ?? 0)));
  $stmt = $connect->prepare('INSERT INTO exercise_progress (user_uid, exercise_id, progress_percent, updated_at) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE progress_percent=VALUES(progress_percent), updated_at=NOW()');
  $stmt->execute([$uid, $exerciseId, $percent]);
}

$stmt = $connect->prepare('SELECT progress_percent FROM exercise_progress WHERE user_uid = ? AND exercise_id = ?');
$stmt->execute([$uid, $exerciseId]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo json_encode(['progress' => (int)($row['progress_percent'] ?? 0)]);
