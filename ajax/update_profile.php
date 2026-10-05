<?php
/**
 * ==========================================================================
 * ajax/update_profile.php
 * Endpoint stub for cpanel/profile.html (profile info form) and
 * cpanel/settings.html (social links + display settings form).
 *
 * Expected request:  Method: POST, Content-Type: multipart/form-data
 *                     Fields vary by form — profile.html sends name, email,
 *                     phone, bio, skills, github, linkedin; settings.html
 *                     sends github, linkedin, x, show_featured, show_stats,
 *                     projects_per_page.
 * Expected response: { "success": true, "message": "Profile updated successfully." }
 *                  or { "success": false, "message": "Unable to update profile." }
 *
 * Authentication: requires an active admin session.
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO:
 * ---------------------------------------------------------------------
 * 1. Verify the request comes from an authenticated admin session.
 * 2. Revalidate and sanitize every field server-side (email format,
 *    URL format for social links, reasonable length limits on bio).
 * 3. Update the relevant row(s) in a `profile` / `settings` MySQL table
 *    (or a single key-value settings table if that fits better).
 * 4. If a new profile photo was included, validate/store it the same
 *    way add_project.php handles project images.
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Profile updated successfully.',
]);
