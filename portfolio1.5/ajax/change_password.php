<?php
/**
 * ==========================================================================
 * ajax/change_password.php
 * Endpoint stub for the Change Password form on cpanel/profile.html.
 *
 * Expected request:  Method: POST, Content-Type: application/json
 *                     Body: { "current": string, "next": string }
 * Expected response: { "success": true,  "message": "Password changed successfully." }
 *                  or { "success": false, "message": "Current password is incorrect." }
 *
 * Authentication: requires an active admin session.
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO:
 * ---------------------------------------------------------------------
 * 1. Verify the request comes from an authenticated admin session.
 * 2. Verify `current` matches the stored password hash with
 *    password_verify() before allowing the change.
 * 3. Revalidate the new password's strength server-side.
 * 4. Hash the new password with password_hash() and update the account.
 * 5. Invalidate other active sessions/remember-me tokens as a security
 *    precaution after a password change.
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Password changed successfully.',
]);
