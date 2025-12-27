const tagService = require('../services/tag.service');

exports.createTag = async (req, res, next) => {
    try {
        const tag = await tagService.createTag(req.user.id, req.body.name);
        res.status(201).json({
            status: 'success',
            data: {
                tag
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllTags = async (req, res, next) => {
    try {
        const tags = await tagService.getTags(req.user.id);
        res.status(200).json({
            status: 'success',
            data: {
                tags
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.addTagsToNote = async (req, res, next) => {
    try {
        const tags = await tagService.addTagsToNote(req.user.id, req.params.noteId, req.body.tagIds);
        res.status(200).json({
            status: 'success',
            data: {
                tags
            }
        });
    } catch (err) {
        next(err);
    }
};

