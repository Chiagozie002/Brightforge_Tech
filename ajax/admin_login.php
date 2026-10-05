<?php
/**
 * ==========================================================================
 * ajax/admin_login.php
 * Endpoint stub for cpanel/login.html.
 *
 * Expected request:
 *   Method: POST, Content-Type: application/json
 *   Body: { "email": string, "password": string, "remember": boolean }
 *
 * Expected response (JSON):
 *   Success: { "success": true,  "message": "Logged in successfully." }
 *   Failure: { "success": false, "message": "Invalid email or password." }
 *
 * Authentication: none yet (this endpoint establishes it).
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO:
 * ---------------------------------------------------------------------
 * 1. Revalidate email format and require a non-empty password server-side.
 * 2. Look up the admin user by email in MySQL.
 * 3. Verify the password with password_verify() against a password_hash()
 *    stored at account creation — NEVER store or compare plain-text
 *    passwords.
 * 4. On success, start a secure PHP session (session_regenerate_id(true))
 *    and store the admin's id/role in $_SESSION.
 * 5. If "remember" is true, issue a signed, httpOnly, secure remember-me
 *    cookie with a long-lived random token stored (hashed) in MySQL —
 *    never store the raw token.
 * 6. Apply login rate limiting / lockout after repeated failures to
 *    mitigate brute-force attempts.
 * 7. Return 401 on invalid credentials, 200 on success.
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

// TEMPORARY STUB RESPONSE — replace with real logic described above.
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Logged in successfully.',
]);
