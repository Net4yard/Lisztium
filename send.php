<?php
// Set your email here (where the application will be sent)
$to = 'szabolcs.szelenyi@net4yard.com'; // <<< IDE ÍRD A SAJÁT EMAIL CÍMED!

// Fetch form data
$name = htmlspecialchars($_POST['name']);
$furigana = htmlspecialchars($_POST['furigana']);
$email = htmlspecialchars($_POST['email']);
$instrument = htmlspecialchars($_POST['instrument']);
$plusone = htmlspecialchars($_POST['plusone']);
$age = htmlspecialchars($_POST['age']);
$school = htmlspecialchars($_POST['school']);
$videolinks = htmlspecialchars($_POST['videolinks']);

// Consent fields (checkboxes)
$consent1 = isset($_POST['consent1']) ? 'Yes' : 'No';
$consent2 = isset($_POST['consent2']) ? 'Yes' : 'No'; // Ez volt kötelező
$consent3 = isset($_POST['consent3']) ? 'Yes' : 'No';

// Email subject and message to YOU
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

// Email headers
$headers = "From: no-reply@net4yard.com\r\n"; // <<< Ezt is lehet majd cserélni saját domainre
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email to you
$mail_sent = mail($to, $subject, $message, $headers);

// Auto-reply to applicant
$reply_subject = "Your application has been received";
$reply_message = "Dear {$name},

Thank you for your application to the Lisztium Masterclasses!
We have successfully received your submission and will get back to you shortly.

Best regards,
Lisztium Masterclasses Team";

$reply_headers = "From: no-reply@net4yard.com\r\n"; // <<< ugyanaz mint fent
$reply_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send auto-reply
$reply_sent = mail($email, $reply_subject, $reply_message, $reply_headers);

// Redirect back or show message
if ($mail_sent && $reply_sent) {
    echo "<script>alert('Your application has been successfully submitted!'); window.location.href='thankyou.html';</script>";
} else {
    echo "<script>alert('There was an error sending your application. Please try again later.'); window.history.back();</script>";
}
?>