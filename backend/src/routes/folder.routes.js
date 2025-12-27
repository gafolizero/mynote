const express = require('express');
const folderController = require('../controllers/folder.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { folderSchema } = require('../utils/validators/folder.validator');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(folderController.getAllFolders)
    .post(validate(folderSchema), folderController.createFolder);

router.route('/:id')
    .patch(validate(folderSchema), folderController.updateFolder)
    .delete(folderController.deleteFolder);

module.exports = router;

