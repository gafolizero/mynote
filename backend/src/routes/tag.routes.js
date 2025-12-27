const express = require('express');
const tagController = require('../controllers/tag.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { tagSchema, linkTagsSchema } = require('../utils/validators/tag.validator');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(tagController.getAllTags)
    .post(validate(tagSchema), tagController.createTag);

router.post('/link/:noteId', validate(linkTagsSchema), tagController.addTagsToNote);

module.exports = router;

