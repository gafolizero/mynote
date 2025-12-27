const noteService = require('../services/note.service');

exports.createNote = async (req, res, next) => {
    try {
        const note = await noteService.createNote(req.user.id, req.body);
        res.status(201).json({ status: 'success', data: { note } });
    } catch (err) { next(err); }
};

exports.getAllNotes = async (req, res, next) => {
    try {
        const { folder_id, isPinned, isArchived, search, tagId, page, limit } = req.query;
        console.log(req.query);

        const filters = {
            folder_id: folder_id ? parseInt(folder_id) : null,
            tagId: tagId ? parseInt(tagId) : null,
            search: search || '',
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            isPinned: isPinned === 'true' ? true : isPinned === 'false' ? false : undefined,
            isArchived: isArchived === 'true' ? true : isArchived === 'false' ? false : false,
        };

        const notes = await noteService.getAllNotes(req.user.id, filters);

        res.status(200).json({
            status: 'success',
            results: notes.length,
            data: { notes }
        });
    } catch (err) {
        next(err);
    }
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

