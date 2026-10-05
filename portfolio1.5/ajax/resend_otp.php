<?php
/**
 * ==========================================================================
 * ajax/resend_otp.php
 * Endpoint stub for the "Resend code" action on cpanel/verify-otp.html.
 *
 * Expected request:  Method: POST (no body required — identify the
 *                     account via the pending-reset session, not client input)
 * Expected response: { "success": true, "message": "A new code has been sent." }
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO:
 * ---------------------------------------------------------------------
 * 1. Identify the account from the pending-reset session set during
 *    forgot_password.php.
 * 2. Invalidate the previous OTP, generate a new one, store it (hashed)
 *    with a fresh expiry.
 * 3. Re-send via email.
 * 4. Rate-limit resend requests (e.g. one per 60 seconds, matching the
 *    frontend countdown) to prevent abuse.
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'A new code has been sent.',
]);
