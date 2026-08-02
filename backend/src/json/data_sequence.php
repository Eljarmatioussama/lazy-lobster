<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require './app_core.php';

$sequenceId = filter_input(INPUT_GET, 'sequence_id', FILTER_VALIDATE_INT);
if (!$sequenceId || $sequenceId < 1) {
    http_response_code(400);
    echo json_encode(array('error' => 'sequence_id is required'));
    exit;
}

$sequenceStatement = $connect->prepare(
    'SELECT sequence_id, sequence_title, sequence_description, category, difficulty, total_duration, peak_pose_id, image_url, created_at, updated_at
     FROM sequences WHERE sequence_id = :sequence_id'
);
$sequenceStatement->execute(array(':sequence_id' => $sequenceId));
$sequence = $sequenceStatement->fetch(PDO::FETCH_ASSOC);

if (!$sequence) {
    http_response_code(404);
    echo json_encode(array('error' => 'sequence not found'));
    exit;
}

$poseStatement = $connect->prepare(
    'SELECT sp.id, sp.pose_id, p.pose_name, p.sanskrit_name, p.category, p.difficulty, p.instructions, p.breathing_cues,
            p.contraindications, p.modifications_easier, p.modifications_harder, p.image_url, p.video_url,
            p.target_areas, sp.order_index, sp.duration_seconds, sp.transition_note
     FROM sequence_poses sp
     INNER JOIN poses p ON p.pose_id = sp.pose_id
     WHERE sp.sequence_id = :sequence_id
     ORDER BY sp.order_index ASC, sp.id ASC'
);
$poseStatement->execute(array(':sequence_id' => $sequenceId));
$poses = $poseStatement->fetchAll(PDO::FETCH_ASSOC);

foreach ($poses as &$pose) {
    $pose['target_areas'] = $pose['target_areas'] ? json_decode($pose['target_areas'], true) : array();
}

$sequence['poses'] = $poses;
echo json_encode($sequence, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
