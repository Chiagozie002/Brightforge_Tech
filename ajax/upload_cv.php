<?php
/**
 * ==========================================================================
 * ajax/upload_cv.php
 * Endpoint stub for the CV upload form on cpanel/profile.html.
 *
 * Expected request:  Method: POST, Content-Type: multipart/form-data
 *                     Field: cv (PDF file)
 * Expected response: { "success": true,  "message": "CV uploaded successfully." }
 *                  or { "success": false, "message": "Unable to upload CV." }
 *
 * Authentication: requires an active admin session.
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO:
 * ---------------------------------------------------------------------
 * 1. Verify the request comes from an authenticated admin session.
 * 2. Validate the uploaded file's real MIME type is application/pdf
 *    (not just its extension) and that it's under the size limit.
 * 3. Store it outside the web root if possible, or in a non-executable
 *    uploads directory with a generated filename.
 * 4. Replace the previous CV file (delete the old one) and update the
 *    stored CV path referenced by about.html's "Download CV" button
 *    (e.g. assets/cv/<generated-name>.pdf).
 * 5. Record the upload timestamp so the admin can see when it was last
 *    updated.
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'CV uploaded successfully.',
]);
