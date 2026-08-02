<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require './app_core.php';

$userId = isset($_GET['user_id']) ? $_GET['user_id'] : '';
if (!$userId || strlen($userId) > 128) {
    http_response_code(400);
    echo json_encode(array('error' => 'valid user_id is required'));
    exit;
}

$sessionStatement = $connect->prepare(
    'SELECT session_id, sequence_id, session_date, duration_minutes, flexibility_score_change, mood, completed, notes
     FROM user_yoga_sessions WHERE user_id = :user_id ORDER BY session_date DESC, session_id DESC'
);
$sessionStatement->execute(array(':user_id' => $userId));
$sessions = $sessionStatement->fetchAll(PDO::FETCH_ASSOC);

$totalSessions = 0;
$totalMinutes = 0;
$dates = array();
foreach ($sessions as &$session) {
    $session['session_id'] = (int) $session['session_id'];
    $session['sequence_id'] = (int) $session['sequence_id'];
    $session['duration_minutes'] = (int) $session['duration_minutes'];
    $session['completed'] = (bool) $session['completed'];
    if ($session['completed']) {
        $totalSessions++;
        $totalMinutes += $session['duration_minutes'];
        $dates[$session['session_date']] = true;
    }
}

$uniqueDates = array_keys($dates);
sort($uniqueDates);
$currentStreak = 0;
$bestStreak = 0;
$run = 0;
$previous = null;
foreach ($uniqueDates as $date) {
    $timestamp = strtotime($date);
    if ($previous !== null && $timestamp - $previous === 86400) $run++;
    else $run = 1;
    $bestStreak = max($bestStreak, $run);
    $previous = $timestamp;
}

$today = strtotime(date('Y-m-d'));
for ($i = count($uniqueDates) - 1; $i >= 0; $i--) {
    $timestamp = strtotime($uniqueDates[$i]);
    if ($i === count($uniqueDates) - 1 && $today - $timestamp > 86400) break;
    if ($i < count($uniqueDates) - 1 && strtotime($uniqueDates[$i + 1]) - $timestamp !== 86400) break;
    $currentStreak++;
}

$profileStatement = $connect->prepare('SELECT flexibility_score FROM user_yoga_profile WHERE user_id = :user_id');
$profileStatement->execute(array(':user_id' => $userId));
$profile = $profileStatement->fetch(PDO::FETCH_ASSOC);

$achievements = array();
if ($totalSessions >= 1) $achievements[] = 'first_session';
if ($currentStreak >= 7 || $bestStreak >= 7) $achievements[] = 'seven_day_streak';
if ($totalSessions >= 10) $achievements[] = 'ten_sessions';
if ($totalMinutes >= 60) $achievements[] = 'sixty_minutes';

echo json_encode(array(
    'current_streak' => $currentStreak,
    'best_streak' => $bestStreak,
    'total_sessions' => $totalSessions,
    'total_minutes' => $totalMinutes,
    'current_score' => $profile ? (int) $profile['flexibility_score'] : null,
    'recent_sessions' => array_slice($sessions, 0, 10),
    'achievements' => $achievements,
), JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
