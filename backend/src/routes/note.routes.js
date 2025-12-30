const express = require('express');
const noteController = require('../controllers/note.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { noteSchema, updateNoteSchema } = require('../utils/validators/note.validator');

const router = express.Router();

router.use(protect); // Secure all note routes

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes for the authenticated user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of notes per page
 *       - in: query
 *         name: folder_id
 *         schema:
 *           type: integer
 *         description: Filter by folder ID (use 'null' for unorganized notes)
 *       - in: query
 *         name: tagId
 *         schema:
 *           type: integer
 *         description: Filter by tag ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and content
 *       - in: query
 *         name: isArchived
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Filter archived notes
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [created_at, updated_at, title]
 *           default: updated_at
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     notes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.route('/')
    .get(noteController.getAllNotes)
    /**
     * @swagger
     * /notes:
     *   post:
     *     summary: Create a new note
     *     tags: [Notes]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *             properties:
     *               title:
     *                 type: string
     *                 maxLength: 255
     *                 example: My New Note
     *               content:
     *                 type: string
     *                 example: This is the content of my note
     *               folder_id:
     *                 type: integer
     *                 nullable: true
     *                 example: 1
     *               is_pinned:
     *                 type: boolean
     *                 default: false
     *                 example: false
     *               is_archived:
     *                 type: boolean
     *                 default: false
     *                 example: false
     *               tagIds:
     *                 type: array
     *                 items:
     *                   type: integer
     *                 example: [1, 2]
     *     responses:
     *       201:
     *         description: Note created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: success
     *                 data:
     *                   type: object
     *                   properties:
     *                     note:
     *                       $ref: '#/components/schemas/Note'
     *       400:
     *         description: Validation error
     *       401:
     *         description: Unauthorized
     */
    .post(validate(noteSchema), noteController.createNote);

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get a specific note by ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     note:
 *                       $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *                 example: Updated Note Title
 *               content:
 *                 type: string
 *                 example: Updated content
 *               folder_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *               is_pinned:
 *                 type: boolean
 *                 example: true
 *               is_archived:
 *                 type: boolean
 *                 example: false
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 3]
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     note:
 *                       $ref: '#/components/schemas/Note'
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       204:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 */
router.route('/:id')
    .get(noteController.getNote)
    .patch(validate(updateNoteSchema), noteController.updateNote)
    .delete(noteController.deleteNote);

module.exports = router;

