const express = require('express');
const noteController = require('../controllers/note.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { noteSchema } = require('../utils/validators/note.validator');

const router = express.Router();

router.use(protect); // Secure all note routes

router.route('/')
    .get(noteController.getAllNotes)
    .post(validate(noteSchema), noteController.createNote);

router.route('/:id')
    .get(noteController.getNote)
    .patch(validate(noteSchema), noteController.updateNote)
    .delete(noteController.deleteNote);

module.exports = router;

