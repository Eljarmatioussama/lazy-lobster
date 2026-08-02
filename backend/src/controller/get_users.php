<?php

require '../admin/config.php';
require './dbconfig.php';

$statement = $DB_con->query('SELECT user_id, email, display_name, created_at FROM app_users ORDER BY created_at DESC');
$data = array();
foreach ($statement->fetchAll(PDO::FETCH_ASSOC) as $user) {
    $data[] = array(
        'uid' => $user['user_id'],
        'displayName' => $user['display_name'],
        'email' => $user['email'],
        'emailVerified' => true,
        'disabled' => false,
        'metadata' => array('createdAt' => $user['created_at'])
    );
}

$results = array(
    "sEcho" => 1,
    "iTotalRecords" => count($data),
    "iTotalDisplayRecords" => count($data),
    "aaData"=>$data);

echo json_encode($results);

?>
