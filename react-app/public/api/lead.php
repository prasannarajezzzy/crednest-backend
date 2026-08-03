<?php
/**
 * Lead endpoint for Apache/PHP hosting (Hostinger).
 *
 * Lives in public/ so the Vite build copies it to dist/api/lead.php verbatim.
 * The browser posts here same-origin, so there is no CORS preflight and no
 * delivery address sits in the public JavaScript bundle.
 *
 * Setup: change LEAD_TO below to the mailbox that should receive enquiries.
 * Nothing is written to disk, deliberately — a lead file under public_html
 * would be downloadable by anyone who guessed its name.
 */

const LEAD_TO = 'contact@crednest.io';
// contact@crednest.io is hosted on Gmail, so delivery TO it follows the domain's
// Google MX records and works from anywhere. Sending FROM it via this Hostinger
// server can fail SPF at Gmail. At DNS setup, extend the domain's SPF TXT record to:
//   v=spf1 include:_spf.google.com include:_spf.mail.hostinger.com ~all
// If the first live test still lands in spam, switch this file to SMTP instead.
// Reply-To is set to the enquirer below, so replying reaches them, not yourself.
const LEAD_FROM = 'contact@crednest.io';

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!is_array($body)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

/** Trim, cap length, and strip CR/LF so no field can inject extra mail headers. */
function field($body, $key, $max = 2000) {
    $value = isset($body[$key]) && is_string($body[$key]) ? trim($body[$key]) : '';
    $value = str_replace(["\r", "\n"], ' ', $value);
    return mb_substr($value, 0, $max);
}

// Honeypot: reply 200 so a bot cannot tell it was rejected, but send nothing.
if (field($body, 'website') !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$name    = field($body, 'name', 200);
$company = field($body, 'company', 200);
$phone   = field($body, 'phone', 40);
$digits  = preg_replace('/\D/', '', $phone);

if ($name === '' || $company === '' || strlen($digits) < 8 || strlen($digits) > 15) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid required fields']);
    exit;
}

$email = field($body, 'email', 200);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $email = '';
}

$rows = [
    'Name'         => $name,
    'Company'      => $company,
    'Phone'        => $phone,
    'Email'        => $email !== '' ? $email : '(not supplied)',
    'Revenue'      => field($body, 'revenue', 100),
    'Funding need' => field($body, 'fundingNeed', 100),
    'Source'       => field($body, 'source', 100),
    'Received'     => gmdate('Y-m-d H:i:s') . ' UTC',
];

$lines = [];
foreach ($rows as $label => $value) {
    if ($value !== '') {
        $lines[] = str_pad($label . ':', 15) . $value;
    }
}

$notes = field($body, 'message', 4000);
if ($notes !== '') {
    $lines[] = '';
    $lines[] = 'What the capital should unlock:';
    $lines[] = $notes;
}

if (!empty($body['metadata']) && is_array($body['metadata'])) {
    $lines[] = '';
    $lines[] = 'Context: ' . json_encode($body['metadata']);
}

$headers = [
    'From: CredNest Website <' . LEAD_FROM . '>',
    'Content-Type: text/plain; charset=utf-8',
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
}

$subject = 'New enquiry: ' . $company . ' (' . $name . ')';
$sent    = @mail(LEAD_TO, $subject, implode("\n", $lines), implode("\r\n", $headers));

if (!$sent) {
    error_log('CredNest lead delivery failed for ' . $company);
    http_response_code(502);
    echo json_encode(['error' => 'Delivery failed']);
    exit;
}

echo json_encode(['ok' => true]);
