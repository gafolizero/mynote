const express = require('express');
const folderController = require('../controllers/folder.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { folderSchema } = require('../utils/validators/folder.validator');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /folders:
 *   get:
 *     summary: Get all folders for the authenticated user
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of folders
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
 *                     folders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Folder'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new folder
 *     tags: [Folders]
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
 *                 maxLength: 100
 *                 example: Work
 *               color:
 *                 type: string
 *                 pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
 *                 example: '#3498db'
 *     responses:
 *       201:
 *         description: Folder created successfully
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
 *                     folder:
 *                       $ref: '#/components/schemas/Folder'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.route('/')
    .get(folderController.getAllFolders)
    .post(validate(folderSchema), folderController.createFolder);

/**
 * @swagger
 * /folders/{id}:
 *   patch:
 *     summary: Update a folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Folder ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: Updated Folder Name
 *               color:
 *                 type: string
 *                 pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
 *                 example: '#e74c3c'
 *     responses:
 *       200:
 *         description: Folder updated successfully
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
 *                     folder:
 *                       $ref: '#/components/schemas/Folder'
 *       404:
 *         description: Folder not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete a folder
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Folder ID
 *     responses:
 *       204:
 *         description: Folder deleted successfully
 *       404:
 *         description: Folder not found
 *       401:
 *         description: Unauthorized
 */
router.route('/:id')
    .patch(validate(folderSchema), folderController.updateFolder)
    .delete(folderController.deleteFolder);

module.exports = router;

