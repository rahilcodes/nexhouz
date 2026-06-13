<?php
/**
 * NexHouz Secure OpenAI API Proxy Script
 * Place this in public/api/chat.php (compiled to out/api/chat.php)
 * Runs securely on Hostinger PHP environment.
 */

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure it is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed. Only POST is supported."]);
    exit();
}

// 1. Get OpenAI API Key
// First try to load from a local config file (not committed to git)
$apiKey = '';
$configFile = __DIR__ . '/openai_key.php';
if (file_exists($configFile)) {
    include($configFile); // Should define $apiKey = 'sk-...';
}

// Fallback to system environment variable
if (empty($apiKey)) {
    $apiKey = getenv('OPENAI_API_KEY');
}

// Fallback to reading from a local .env file in the root
if (empty($apiKey)) {
    $envFile = __DIR__ . '/../../.env';
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;
            list($name, $value) = explode('=', $line, 2);
            if (trim($name) === 'OPENAI_API_KEY') {
                $apiKey = trim($value, " '\"");
                break;
            }
        }
    }
}

if (empty($apiKey)) {
    http_response_code(500);
    echo json_encode([
        "error" => "OpenAI API Key is not configured on the server. Please define \$apiKey in public/api/openai_key.php or set the OPENAI_API_KEY environment variable."
    ]);
    exit();
}

// 2. Read input payload
$inputData = file_get_contents('php://input');
$payload = json_decode($inputData, true);

if (!$payload || !isset($payload['messages'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid payload. 'messages' array is required."]);
    exit();
}

// 3. Prepare cURL request to OpenAI
$ch = curl_init('https://api.openai.com/v1/chat/completions');

$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
];

$postData = json_encode([
    'model' => isset($payload['model']) ? $payload['model'] : 'gpt-4o-mini',
    'messages' => $payload['messages'],
    'temperature' => isset($payload['temperature']) ? $payload['temperature'] : 0.7,
    'max_tokens' => isset($payload['max_tokens']) ? $payload['max_tokens'] : 800
]);

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

// Execute cURL request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    $errorMsg = curl_error($ch);
    curl_close($ch);
    http_response_code(502);
    echo json_encode(["error" => "cURL Transport Error: " . $errorMsg]);
    exit();
}

curl_close($ch);

// 4. Return response
http_response_code($httpCode);
echo $response;
exit();
