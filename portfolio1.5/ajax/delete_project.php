<?php
/**
 * ==========================================================================
 * ajax/delete_project.php
 * Endpoint stub for the Delete action (with confirmation modal) on
 * cpanel/projects.html.
 *
 * Expected request:  Method: POST, Content-Type: application/json
 *                     Body: { "id": number|string }
 * Expected response: { "success": true,  "message": "Project deleted." }
 *                  or { "success": false, "message": "Unable to delete project." }
 *
 * Authentication: requires an active admin session.
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO:
 * ---------------------------------------------------------------------
 * 1. Verify the request comes from an authenticated admin session.
 * 2. Confirm the project `id` exists and belongs to this portfolio.
 * 3. Delete the associated image file from storage.
 * 4. Delete the row from the `projects` MySQL table.
 * 5. Consider a soft-delete (status = 'deleted') instead of a hard
 *    delete if an undo/recovery feature is ever wanted.
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Project deleted.',
]);
