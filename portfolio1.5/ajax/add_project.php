<?php
/**
 * ==========================================================================
 * ajax/add_project.php
 * Endpoint stub for cpanel/add-project.html.
 *
 * Expected request:  Method: POST, Content-Type: multipart/form-data
 *                     Fields: name, description, category, status,
 *                             technologies, demo_url, github_url, featured,
 *                             image (file)
 * Expected response: { "success": true,  "message": "Project added successfully." }
 *                  or { "success": false, "message": "Unable to add project.",
 *                        "errors": { "field_name": "message" } }
 *
 * Authentication: requires an active admin session.
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO:
 * ---------------------------------------------------------------------
 * 1. Verify the request comes from an authenticated admin session.
 * 2. Revalidate every field server-side (required fields, length limits,
 *    URL format for demo_url/github_url).
 * 3. Validate the uploaded image: real MIME type (not just extension),
 *    file size, and re-encode/strip EXIF data before storing.
 * 4. Store the image in a non-executable uploads directory with a
 *    generated filename (don't trust the original filename).
 * 5. Insert the project into a `projects` table in MySQL, e.g.:
 *      id, name, description, category, technologies, image_path,
 *      demo_url, github_url, status, featured, created_at
 * 6. Return field-level validation errors in the `errors` object when
 *    applicable, so the frontend can highlight the right inputs.
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Project added successfully.',
]);
