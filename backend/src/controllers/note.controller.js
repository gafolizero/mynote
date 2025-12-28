const noteService = require('../services/note.service');

exports.createNote = async (req, res, next) => {
    try {
        const note = await noteService.createNote(req.user.id, req.body);
        res.status(201).json({ status: 'success', data: { note } });
    } catch (err) { next(err); }
};

exports.getAllNotes = async (req, res, next) => {
    try {
        const notes = await noteService.getAllNotes(req.user.id, {
            folder_id: req.query.folder_id,
            tagId: req.query.tagId,
            search: req.query.search,
            page: req.query.page,
            limit: req.query.limit,
            isArchived: req.query.isArchived
        });

        res.status(200).json({ status: 'success', data: { notes } });
    } catch (err) { next(err); }
};

exports.getNote = async (req, res, next) => {
    try {
        const note = await noteService.getNote(req.params.id, req.user.id);
        res.status(200).json({
            status: 'success',
            data: {
                note
            }
        });
    } catch (err) { next(err); }
};

exports.updateNote = async (req, res, next) => {
    try {
        const note = await noteService.updateNote(req.params.id, req.user.id, req.body);
        res.status(200).json({
            status: 'success',
            data: {
                note
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteNote = async (req, res, next) => {
    try {
        await noteService.deleteNote(req.params.id, req.user.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

