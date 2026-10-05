<?php
/**
 * ==========================================================================
 * ajax/send_message.php
 * Endpoint stub for the public contact form (contact.html / contact.js).
 *
 * Expected request:
 *   Method: POST
 *   Content-Type: application/json
 *   Body: { "name": string, "email": string, "subject": string, "message": string }
 *
 * Expected response (JSON):
 *   Success: { "success": true,  "message": "Your message has been sent successfully." }
 *   Failure: { "success": false, "message": "Unable to send your message." }
 *
 * Authentication: none (public endpoint).
 *
 * ---------------------------------------------------------------------
 * BACKEND TODO (not implemented yet — frontend-only stub):
 * ---------------------------------------------------------------------
 * 1. Revalidate every field server-side (never trust client validation):
 *      - name:    required, 2–80 chars
 *      - email:   required, valid email format
 *      - subject: required, 3–120 chars
 *      - message: required, 10–2000 chars
 * 2. Sanitize all input before storage/output (escape for SQL + HTML).
 * 3. Store the message in a `messages` table in MySQL, e.g.:
 *      id, name, email, subject, message, created_at, is_read
 * 4. Optionally send an email notification to the site owner (e.g. via
 *    PHPMailer / SMTP) and/or an auto-reply to the sender.
 * 5. Apply basic rate limiting / spam protection (e.g. honeypot field,
 *    simple timing check, or a CAPTCHA if abuse becomes an issue).
 * 6. Return a proper HTTP status code alongside the JSON body
 *    (200 on success, 422 on validation failure, 500 on server error).
 * ---------------------------------------------------------------------
 */

header('Content-Type: application/json');

// TEMPORARY STUB RESPONSE — replace with real logic described above.
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Your message has been sent successfully.',
]);
