<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Hibakezelés bekapcsolása - Good for development, consider adjusting for production
error_reporting(E_ALL);
ini_set('display_errors', 1); // In production, log errors to Stackdriver Logging instead of displaying them

$smtpUsername = getenv('SMTP_USER') ?: 'fallback_user@example.com'; // Fallback for local testing if needed
$smtpPassword = getenv('SMTP_PASS') ?: 'fallback_password';
$smtpHost = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
$adminEmail = getenv('ADMIN_EMAIL') ?: 'admin@example.com';
$fromEmail = getenv('FROM_EMAIL') ?: 'noreply@example.com';
$fromName = getenv('FROM_NAME') ?: 'My Application';

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// If JSON parsing failed, check for regular POST data
if (json_last_error() !== JSON_ERROR_NONE) {
    $data = $data;
}

// Ellenőrizzük, hogy POST kérés érkezett-e
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method. Only POST is accepted.']);
    exit();
}

// Form adatok validálása
$required_fields = ['name', 'email', 'instrument', 'plusone', 'age', 'consent2'];
$errors = [];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        $errors[] = "Field '{$field}' is required.";
    }
}

if (!empty($errors)) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Please fill all required fields.', 'errors' => $errors]);
    exit();
}

// Adatok tisztítása
$name = isset($data['name']) ? htmlspecialchars(trim($data['name'])) : '';
$furigana = isset($data['furigana']) ? htmlspecialchars(trim($data['furigana'])) : 'N/A';
$email = isset($data['email']) ? filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL) : '';
$instrument = isset($data['instrument']) ? htmlspecialchars(trim($data['instrument'])) : '';
$plusone = isset($data['plusone']) ? htmlspecialchars(trim($data['plusone'])) : '';
$age = isset($data['age']) ? htmlspecialchars(trim($data['age'])) : '';
$school = isset($data['school']) ? htmlspecialchars(trim($data['school'])) : 'N/A';
$videolinks = isset($data['videolinks']) ? htmlspecialchars(trim($data['videolinks'])) : 'N/A';
$consent1 = isset($data['consent1']) && $data['consent1'] === 'on' ? 'Yes' : 'No';
$consent2 = isset($data['consent2']) && $data['consent2'] === 'on' ? 'Yes' : 'No';
$consent3 = isset($data['consent3']) && $data['consent3'] === 'on' ? 'Yes' : 'No';


// Email tartalom
$subjectToAdmin = "Application - {$name}";
$messageToAdmin = "
New Application Received:

Name: {$name}
フリガナ: {$furigana}
Email: {$email}
Instrument: {$instrument}
Optional plus one class: {$plusone}
Age: {$age}
Current School/Institution: {$school}
Video links: {$videolinks}

Consents:
- Processing Personal Info: {$consent1}
- Photos Usage Consent: {$consent2}
- Privacy Policy Accepted: {$consent3}
";

// Auto-reply content
$subjectToUser = "Your application to Lisztium Masterclasses has been received";
$bodyToUser = "Dear {$name},\n\nThank you for your application to the Lisztium Masterclasses!\nWe have successfully received your submission and will get back to you shortly.\n\nBest regards,\nLisztium Masterclasses Team";


try {
    // --- Admin Email ---
    $mailAdmin = new PHPMailer(true);
    $mailAdmin->isSMTP();
    $mailAdmin->Host = $smtpHost; // Use environment variable
    $mailAdmin->SMTPAuth = true;
    $mailAdmin->Username = $smtpUsername; // Use environment variable
    $mailAdmin->Password = $smtpPassword; // Use environment variable
    $mailAdmin->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mailAdmin->Port = 587;
    $mailAdmin->CharSet = 'UTF-8';
    
    $mailAdmin->setFrom($fromEmail, $fromName); // Use environment variables
    $mailAdmin->addAddress($adminEmail, 'Admin'); // Use environment variable
    $mailAdmin->Subject = $subjectToAdmin;
    $mailAdmin->Body = nl2br(htmlspecialchars($messageToAdmin)); // Convert newlines to <br> and escape HTML
    $mailAdmin->AltBody = $messageToAdmin; // Plain text version
    
    $mailAdmin->send(); // No need for if !; it will throw an exception on failure
    
    // --- Auto-reply to User ---
    $replyUser = new PHPMailer(true);
    $replyUser->isSMTP();
    $replyUser->Host = $smtpHost;
    $replyUser->SMTPAuth = true;
    $replyUser->Username = $smtpUsername;
    $replyUser->Password = $smtpPassword;
    $replyUser->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $replyUser->Port = 587;
    $replyUser->CharSet = 'UTF-8';
    
    $replyUser->setFrom($fromEmail, $fromName);
    $replyUser->addAddress($email, $name); // User's email and name
    $replyUser->Subject = $subjectToUser;
    $replyUser->Body = nl2br(htmlspecialchars($bodyToUser));
    $replyUser->AltBody = $bodyToUser;
    
    $replyUser->send();

    // --- Success Response ---
    // Instead of redirecting from PHP, it's generally better to send a JSON response
    // and let your React frontend handle the redirect or display a success message.
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Application submitted and confirmation sent.']);
    exit();
    
    // If you absolutely must redirect from PHP and `thankyou.html` is in the same directory:
    // header('Location: thankyou.html'); // Ensure thankyou.html is deployed with your app
    // exit();
    
} catch (Exception $e) {
    error_log('PHPMailer Error: ' . $e->getMessage() . ' | SMTP Error: ' . (isset($mailAdmin) ? $mailAdmin->ErrorInfo : (isset($replyUser) ? $replyUser->ErrorInfo : 'N/A')));
    http_response_code(500); // Internal Server Error
    echo json_encode(['status' => 'error', 'message' => "Message could not be sent. Please try again later."]);
    // For debugging, you might include: 'debug_info' => $e->getMessage() // But be careful exposing too much in production
}
?>