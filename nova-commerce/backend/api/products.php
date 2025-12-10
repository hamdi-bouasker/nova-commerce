<?php
// backend/api/products.php
require_once '../config/cors.php';
require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        handleGet($conn);
        break;
    case 'POST':
        handlePost($conn);
        break;
    case 'PUT':
        handlePut($conn);
        break;
    case 'DELETE':
        handleDelete($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
}

function handleGet($conn) {
    if (isset($_GET['id'])) {
        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $product = $stmt->fetch();
        if ($product) {
            // Ensure numeric types are returned as numbers
            $product['price'] = (float)$product['price'];
            $product['stock'] = (int)$product['stock'];
            echo json_encode($product);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
        }
    } else {
        $stmt = $conn->query("SELECT * FROM products ORDER BY created_at DESC");
        $products = $stmt->fetchAll();
        // Cast types
        foreach ($products as &$p) {
            $p['price'] = (float)$p['price'];
            $p['stock'] = (int)$p['stock'];
        }
        echo json_encode($products);
    }
}

function handlePost($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate
    if (!isset($data['name']) || !isset($data['price'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }

    $sql = "INSERT INTO products (name, price, category, stock, description, image) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    try {
        $stmt->execute([
            $data['name'], 
            $data['price'], 
            $data['category'] ?? 'Uncategorized', 
            $data['stock'] ?? 0, 
            $data['description'] ?? '', 
            $data['image'] ?? ''
        ]);
        
        $id = $conn->lastInsertId();
        echo json_encode(['message' => 'Product Created', 'id' => $id]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handlePut($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID required']);
        return;
    }

    $fields = [];
    $params = [];
    
    // Dynamic update builder
    $allowed = ['name', 'price', 'category', 'stock', 'description', 'image'];
    foreach ($allowed as $field) {
        if (isset($data[$field])) {
            $fields[] = "$field = ?";
            $params[] = $data[$field];
        }
    }

    if (empty($fields)) {
        echo json_encode(['message' => 'No changes provided']);
        return;
    }

    $params[] = $data['id']; // For WHERE clause
    $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?";
    
    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['message' => 'Product Updated']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handleDelete($conn) {
    // Read from query string or body
    $id = $_GET['id'] ?? null;
    if (!$id) {
         $data = json_decode(file_get_contents('php://input'), true);
         $id = $data['id'] ?? null;
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID required']);
        return;
    }

    try {
        $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['message' => 'Product Deleted']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
