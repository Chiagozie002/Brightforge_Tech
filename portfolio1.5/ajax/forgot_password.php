<?php
/**
 * ==========================================================================
 * ajax/forgot_password.php
 * Endpoint stub for cpanel/forgot-password.html.
 *
 * Expected request:  Method: POST, Content-Type: application/json
 *                     Body: { "email": string }
 * Expected response: { "success": true,  "message": "Reset instructions sent." }
 *                  or { "success": false, "message": "We couldn't find that account." }
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO:
 * ---------------------------------------------------------------------
 * 1. Revalidate the email format server-side.
 * 2. Look up the admin account by email. For privacy, consider always
 *    returning a generic success message regardless of whether the
 *    account exists, to avoid leaking which emails are registered.
 * 3. Generate a 6-digit OTP, store it (hashed) with an expiry timestamp
 *    (e.g. 10 minutes) against the account/session.
 * 4. Email the OTP to the user (e.g. via PHPMailer / SMTP).
 * 5. Rate-limit repeated requests for the same email/IP.
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'If that email is registered, a reset code has been sent.',
]);
