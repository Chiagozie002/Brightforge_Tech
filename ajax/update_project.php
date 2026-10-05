<?php
/**
 * ==========================================================================
 * ajax/update_project.php
 * Endpoint stub for the (future) Edit Project flow from cpanel/projects.html.
 *
 * Expected request:  Method: POST, Content-Type: multipart/form-data
 *                     Fields: id, plus any of the fields from add_project.php
 *                     (image optional — only send if replacing it)
 * Expected response: { "success": true,  "message": "Project updated successfully." }
 *                  or { "success": false, "message": "Unable to update project." }
 *
 * Authentication: requires an active admin session.
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO:
 * ---------------------------------------------------------------------
 * 1. Verify the request comes from an authenticated admin session.
 * 2. Confirm the project `id` exists before updating.
 * 3. Revalidate all submitted fields server-side (same rules as
 *    add_project.php).
 * 4. If a new image was uploaded, validate and store it, then delete the
 *    old image file to avoid orphaned uploads.
 * 5. Update the matching row in the `projects` MySQL table.
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Project updated successfully.',
]);
