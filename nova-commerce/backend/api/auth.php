<?php
// backend/api/auth.php
require_once '../config/cors.php';
require_once '../config/db.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
ini_set('html_errors', 0); // Ensure errors are plain text, not HTML
error_reporting(E_ALL);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $_GET['action'] ?? $data['action'] ?? 'login';

    if ($action === 'register') {
        register($conn, $data);
    } else {
        login($conn, $data);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}

function login($conn, $data) {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password required']);
        return;
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Success
        unset($user['password']); // Don't send password back
        echo json_encode(['user' => $user, 'token' => 'mock-jwt-token-' . $user['id']]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
}

function register($conn, $data) {
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    if (!$name || !$email || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, email, and password required']);
        return;
    }

    // Check if exists
    try {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'User already exists']);
            return;
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error (Check if tables exist): ' . $e->getMessage()]);
        return;
    }

    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $role = 'CUSTOMER'; // Default
    
    // Backdoor for admin test (as per user's original code)
    if (strpos($email, 'admin') !== false) $role = 'ADMIN';

    $sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute([$name, $email, $hashed, $role]);
        
        $id = $conn->lastInsertId();
        
        $newUser = [
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'role' => $role
        ];
        
        echo json_encode(['user' => $newUser, 'token' => 'mock-jwt-token-' . $id]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
    }
}
?>
