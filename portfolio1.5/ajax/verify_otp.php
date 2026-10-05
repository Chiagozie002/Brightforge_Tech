<?php
/**
 * ==========================================================================
 * ajax/verify_otp.php
 * Endpoint stub for cpanel/verify-otp.html.
 *
 * Expected request:  Method: POST, Content-Type: application/json
 *                     Body: { "code": string (6 digits) }
 * Expected response: { "success": true,  "message": "Code verified." }
 *                  or { "success": false, "message": "That code didn't match. Try again." }
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO:
 * ---------------------------------------------------------------------
 * 1. Identify which account this OTP belongs to (e.g. via a short-lived
 *    session/token set during forgot_password.php, not from client input).
 * 2. Compare the submitted code against the stored (hashed) OTP and
 *    check it hasn't expired.
 * 3. On success, issue a short-lived, single-use "password reset" token
 *    (e.g. in session) that reset_password.php will require — this
 *    prevents someone from skipping straight to reset-password.html.
 * 4. Limit verification attempts per OTP (e.g. 5 tries) to prevent
 *    brute-forcing a 6-digit code.
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Code verified.',
]);
