const express = require('express');
const tagController = require('../controllers/tag.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { tagSchema, linkTagsSchema } = require('../utils/validators/tag.validator');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Get all tags for the authenticated user
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tags
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
 *                     tags:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Tag'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: Important
 *     responses:
 *       201:
 *         description: Tag created successfully
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
 *                     tag:
 *                       $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Validation error or tag already exists
 *       401:
 *         description: Unauthorized
 */
router.route('/')
    .get(tagController.getAllTags)
    .post(validate(tagSchema), tagController.createTag);

/**
 * @swagger
 * /tags/link/{noteId}:
 *   post:
 *     summary: Link tags to a note
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
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
 *             required:
 *               - tagIds
 *             properties:
 *               tagIds:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Tags linked successfully
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
 *                     tags:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 */
router.post('/link/:noteId', validate(linkTagsSchema), tagController.addTagsToNote);

module.exports = router;

