<?php
/**
 * ==========================================================================
 * ajax/reset_password.php
 * Endpoint stub for cpanel/reset-password.html.
 *
 * Expected request:  Method: POST, Content-Type: application/json
 *                     Body: { "password": string }
 * Expected response: { "success": true,  "message": "Password reset successfully." }
 *                  or { "success": false, "message": "Unable to reset password." }
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO:
 * ---------------------------------------------------------------------
 * 1. Require the single-use reset token issued by verify_otp.php (e.g.
 *    in session) — reject the request if it's missing/expired, so this
 *    endpoint can't be hit directly without completing OTP verification.
 * 2. Revalidate password strength server-side (min length, character
 *    variety) — never trust the frontend's requirement checklist alone.
 * 3. Hash the new password with password_hash() and update the account.
 * 4. Invalidate the reset token so it cannot be reused.
 * 5. Invalidate any existing sessions/remember-me tokens for the account
 *    as a security precaution.
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Password reset successfully.',
]);
