<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Hibakezelés bekapcsolása
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Ellenőrizzük, hogy POST kérés érkezett-e
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die("<script>alert('Invalid request method.'); window.history.back();</script>");
}

// Form adatok validálása
$required_fields = ['name', 'furigana', 'email', 'instrument', 'plusone', 'age', 'consent2'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        die("<script>alert('Please fill all required fields.'); window.history.back();</script>");
    }
}

// Adatok tisztítása
$name = htmlspecialchars($_POST['name']);
$furigana = htmlspecialchars($_POST['furigana']);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("<script>alert('Invalid email address.'); window.history.back();</script>");
}
$instrument = htmlspecialchars($_POST['instrument']);
$plusone = htmlspecialchars($_POST['plusone']);
$age = htmlspecialchars($_POST['age']);
$school = isset($_POST['school']) ? htmlspecialchars($_POST['school']) : 'N/A';
$videolinks = isset($_POST['videolinks']) ? htmlspecialchars($_POST['videolinks']) : 'N/A';
$consent1 = isset($_POST['consent1']) ? 'Yes' : 'No';
$consent2 = isset($_POST['consent2']) ? 'Yes' : 'No';
$consent3 = isset($_POST['consent3']) ? 'Yes' : 'No';

// Email tartalom
$subject = "Application - {$name}";
$message = "
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

try {
    // SMTP konfiguráció
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'szabolcs.szelenyi@net4yard.com';
    $mail->Password = 'paxrdmxwfxnfmebm';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';
    
    // Fő e-mail (adminnak)
    $mail->setFrom('szabolcs.szelenyi@net4yard.com', 'Lisztium');
    $mail->addAddress('szabolcs.szelenyi@net4yard.com', 'Admin');
    $mail->Subject = $subject;
    $mail->Body = $message;
    
    if (!$mail->send()) {
        throw new Exception('Admin email could not be sent.');
    }
    
    // Auto-reply a felhasználónak
    $reply = new PHPMailer(true);
    $reply->isSMTP();
    $reply->Host = 'smtp.gmail.com';
    $reply->SMTPAuth = true;
    $reply->Username = 'szabolcs.szelenyi@net4yard.com';
    $reply->Password = 'paxrdmxwfxnfmebm';
    $reply->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $reply->Port = 587;
    $reply->CharSet = 'UTF-8';
    
    $reply->setFrom('szabolcs.szelenyi@net4yard.com', 'Lisztium');
    $reply->addAddress($email, $name);
    $reply->Subject = "Your application has been received";
    $reply->Body = "Dear {$name},\n\nThank you for your application to the Lisztium Masterclasses!\nWe have successfully received your submission and will get back to you shortly.\n\nBest regards,\nLisztium Masterclasses Team";
    
    if (!$reply->send()) {
        throw new Exception('Auto-reply could not be sent.');
    }
    
    // Sikeres küldés
    header('Location: thankyou.html');
    exit();
    
} catch (Exception $e) {
    error_log('Email error: ' . $e->getMessage());
    echo "<script>alert('Error sending email. Please try again later.'); window.history.back();</script>";
}
?>