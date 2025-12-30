const noteService = require('../services/note.service');
const logger = require('../utils/logger');

exports.createNote = async (req, res, next) => {
    try {
        const note = await noteService.createNote(req.user.id, req.body);
        logger.info('Note created', {
            noteId: note.id,
            userId: req.user.id,
            title: note.title,
        });
        res.status(201).json({ status: 'success', data: { note } });
    } catch (err) {
        logger.error('Failed to create note', {
            error: err.message,
            userId: req.user.id,
        });
        next(err);
    }
};

exports.getAllNotes = async (req, res, next) => {
    try {
        const notes = await noteService.getAllNotes(req.user.id, {
            folder_id: req.query.folder_id,
            tagId: req.query.tagId,
            search: req.query.search,
            page: req.query.page,
            limit: req.query.limit,
            isArchived: req.query.isArchived,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        });

        logger.debug('Notes retrieved', {
            userId: req.user.id,
            count: notes.length,
            filters: req.query,
        });

        res.status(200).json({ status: 'success', data: { notes } });
    } catch (err) {
        logger.error('Failed to get notes', {
            error: err.message,
            userId: req.user.id,
        });
        next(err);
    }
};

exports.getNote = async (req, res, next) => {
    try {
        const note = await noteService.getNote(req.params.id, req.user.id);
        logger.debug('Note retrieved', {
            noteId: req.params.id,
            userId: req.user.id,
        });
        res.status(200).json({
            status: 'success',
            data: {
                note
            }
        });
    } catch (err) {
        logger.error('Failed to get note', {
            error: err.message,
            noteId: req.params.id,
            userId: req.user.id,
        });
        next(err);
    }
};

exports.updateNote = async (req, res, next) => {
    try {
        const note = await noteService.updateNote(req.params.id, req.user.id, req.body);
        logger.info('Note updated', {
            noteId: req.params.id,
            userId: req.user.id,
            title: note.title,
        });
        res.status(200).json({
            status: 'success',
            data: {
                note
            }
        });
    } catch (err) {
        logger.error('Failed to update note', {
            error: err.message,
            noteId: req.params.id,
            userId: req.user.id,
        });
        next(err);
    }
};

exports.deleteNote = async (req, res, next) => {
    try {
        await noteService.deleteNote(req.params.id, req.user.id);
        logger.info('Note deleted', {
            noteId: req.params.id,
            userId: req.user.id,
        });
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        logger.error('Failed to delete note', {
            error: err.message,
            noteId: req.params.id,
            userId: req.user.id,
        });
        next(err);
    }
};

