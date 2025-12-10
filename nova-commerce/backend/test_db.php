<?php
// backend/test_db.php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    if (!file_exists('config/db.php')) {
        throw new Exception('config/db.php not found');
    }
    
    // Capture output of db.php in case it echoes errors
    ob_start();
    require_once 'config/db.php';
    $output = ob_get_clean();
    
    // Check if $conn exists
    if (isset($conn) && $conn instanceof PDO) {
        $status = $conn->getAttribute(PDO::ATTR_CONNECTION_STATUS);
        echo json_encode([
            'status' => 'success',
            'message' => 'Database Connected Successfully!',
            'db_info' => $status,
            'env_loaded' => file_exists('../.env') ? 'Yes' : 'No (.env not found in parent)',
            'root_env_loaded' => file_exists('../../.env') ? 'Yes' : 'No (.env not found in root)'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Connection failed (conn object missing)',
            'output' => $output
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
}
?>
