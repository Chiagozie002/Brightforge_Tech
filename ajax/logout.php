<?php
/**
 * ==========================================================================
 * ajax/logout.php
 * Endpoint stub for the admin sidebar/profile-dropdown Logout actions.
 *
 * Expected request:  Method: POST (no body required)
 * Expected response: { "success": true, "message": "Logged out successfully." }
 *
 * Authentication: requires an active admin session.
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO:
 * ---------------------------------------------------------------------
 * 1. Destroy the PHP session ($_SESSION = []; session_destroy();).
 * 2. If a remember-me cookie was issued, clear it and invalidate its
 *    token in MySQL.
 * 3. Return 200 regardless (logout should always "succeed" from the
 *    client's perspective).
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully.',
]);
