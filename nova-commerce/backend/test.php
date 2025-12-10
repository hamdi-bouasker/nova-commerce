<?php
// backend/test.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
echo json_encode([
    'message' => 'Backend is working!',
    'php_version' => phpversion(),
    'method' => $_SERVER['REQUEST_METHOD']
]);
?>
