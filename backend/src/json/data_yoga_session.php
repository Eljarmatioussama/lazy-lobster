<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require './app_core.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('error' => 'POST is required'));
    exit;
}

$json = json_decode(file_get_contents('php://input'), true);
$input = is_array($json) ? array_merge($_POST, $json) : $_POST;
$required = array('user_id', 'sequence_id', 'session_date', 'duration_minutes');
foreach ($required as $field) {
    if (!isset($input[$field]) || $input[$field] === '') {
        http_response_code(400);
        echo json_encode(array('error' => $field . ' is required'));
        exit;
    }
}

$userId = (string) $input['user_id'];
$sequenceId = filter_var($input['sequence_id'], FILTER_VALIDATE_INT);
$duration = filter_var($input['duration_minutes'], FILTER_VALIDATE_INT);
$scoreChange = isset($input['flexibility_score_change']) && $input['flexibility_score_change'] !== '' ? filter_var($input['flexibility_score_change'], FILTER_VALIDATE_INT) : null;
$completed = !isset($input['completed']) || filter_var($input['completed'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) !== false;

if (!$userId || strlen($userId) > 128 || !$sequenceId || $sequenceId < 1 || $duration === false || $duration < 1 || $duration > 255 || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $input['session_date'])) {
    http_response_code(400);
    echo json_encode(array('error' => 'invalid session data'));
    exit;
}

$mood = isset($input['mood']) && $input['mood'] !== '' ? $input['mood'] : null;
$allowedMoods = array('relaxed', 'energized', 'sore', 'challenged', 'peaceful');
if ($mood !== null && !in_array($mood, $allowedMoods, true)) {
    http_response_code(400);
    echo json_encode(array('error' => 'invalid mood'));
    exit;
}

try {
    $connect->beginTransaction();
    $insert = $connect->prepare(
        'INSERT INTO user_yoga_sessions
         (user_id, sequence_id, session_date, duration_minutes, flexibility_score_change, mood, completed, notes)
         VALUES (:user_id, :sequence_id, :session_date, :duration_minutes, :score_change, :mood, :completed, :notes)'
    );
    $insert->execute(array(
        ':user_id' => $userId,
        ':sequence_id' => $sequenceId,
        ':session_date' => $input['session_date'],
        ':duration_minutes' => $duration,
        ':score_change' => $scoreChange,
        ':mood' => $mood,
        ':completed' => $completed ? 1 : 0,
        ':notes' => isset($input['notes']) ? $input['notes'] : null,
    ));
    $sessionId = (int) $connect->lastInsertId();

    $update = $connect->prepare(
        'UPDATE user_yoga_profile
         SET flexibility_score = GREATEST(1, LEAST(10, ROUND(3 + COALESCE((SELECT AVG(flexibility_score_change) FROM user_yoga_sessions WHERE user_id = :average_user_id), 0))))
         WHERE user_id = :profile_user_id'
    );
    $update->execute(array(':average_user_id' => $userId, ':profile_user_id' => $userId));
    $connect->commit();

    echo json_encode(array('success' => true, 'session_id' => $sessionId), JSON_NUMERIC_CHECK);
} catch (Exception $error) {
    if ($connect->inTransaction()) $connect->rollBack();
    http_response_code(500);
    echo json_encode(array('error' => 'unable to save yoga session'));
}
