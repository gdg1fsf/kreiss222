<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Получаем данные из POST запроса
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
    exit;
}

// Настройки Telegram
$botToken = '8909712142:AAEjeYE1Czj3_O_v2TqNgW1cLlZWAQWNYAo';
$chatId = '6045154952';

// Проверяем обязательные поля
if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Экранируем данные
$name = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($data['email'], ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8');
$time = date('d.m.Y H:i:s');

// Формируем сообщение для Telegram
$telegramMessage = "🎨 <b>Новая заявка с сайта!</b>\n\n";
$telegramMessage .= "👤 <b>Имя:</b> {$name}\n";
$telegramMessage .= "📧 <b>Email:</b> {$email}\n\n";
$telegramMessage .= "💬 <b>Сообщение:</b>\n{$message}\n\n";
$telegramMessage .= "⏰ <b>Время:</b> {$time}";

// Отправляем запрос к Telegram API
$telegramUrl = "https://api.telegram.org/bot{$botToken}/sendMessage";

$postData = [
    'chat_id' => $chatId,
    'text' => $telegramMessage,
    'parse_mode' => 'HTML'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $telegramUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Проверяем результат
if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Network error: ' . $curlError
    ]);
    exit;
}

$result = json_decode($response, true);

if ($httpCode === 200 && $result && $result['ok']) {
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => isset($result['description']) ? $result['description'] : 'Unknown error',
        'telegram_response' => $result
    ]);
}
?>
