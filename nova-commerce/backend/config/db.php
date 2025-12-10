<?php
// backend/config/db.php

// Helper to safely load .env file
function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }
    // Using @ to suppress potential open_basedir warnings if we can't read it
    $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

// Try to load from root (2 directories up from backend/config)
loadEnv(__DIR__ . '/../../.env');

// --- DATABASE CONFIGURATION ---
// Get from environment only
function get_env_var($key) {
    if (isset($_ENV[$key])) return $_ENV[$key];
    if (isset($_SERVER[$key])) return $_SERVER[$key];
    if (getenv($key) !== false) return getenv($key);
    return null;
}

$host = get_env_var('DB_HOST');
$db_name = get_env_var('DB_NAME');
$username = get_env_var('DB_USER');
$password = get_env_var('DB_PASS');

// Validate configuration
if (!$host || !$db_name || !$username) {
    // We do not output specific missing keys for security, but we must log or show a generic error.
    // For API development, a JSON error is appropriate.
    http_response_code(500);
    echo json_encode(['error' => 'Database configuration missing. Please check .env or server variables.']);
    exit();
}

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    // In production, you might not want to show the full error message, but for now we keep it to debug connection issues.
    echo json_encode(['error' => 'Connection Error: ' . $e->getMessage()]);
    exit();
}
?>
