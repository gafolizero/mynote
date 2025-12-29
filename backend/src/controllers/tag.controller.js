const tagService = require('../services/tag.service');
const logger = require('../utils/logger');

exports.createTag = async (req, res, next) => {
    try {
        const tag = await tagService.createTag(req.user.id, req.body.name);
        logger.info('Tag created', {
            tagId: tag.id,
            userId: req.user.id,
            name: tag.name,
        });
        res.status(201).json({
            status: 'success',
            data: {
                tag
            }
        });
    } catch (err) {
        logger.error('Failed to create tag', {
            error: err.message,
            userId: req.user.id,
        });
        next(err);
    }
};

exports.getAllTags = async (req, res, next) => {
    try {
        const tags = await tagService.getTags(req.user.id);
        logger.debug('Tags retrieved', {
            userId: req.user.id,
            count: tags.length,
        });
        res.status(200).json({
            status: 'success',
            data: {
                tags
            }
        });
    } catch (err) {
        logger.error('Failed to get tags', {
            error: err.message,
            userId: req.user.id,
        });
        next(err);
    }
};

exports.addTagsToNote = async (req, res, next) => {
    try {
        const tags = await tagService.addTagsToNote(req.user.id, req.params.noteId, req.body.tagIds);
        logger.info('Tags added to note', {
            noteId: req.params.noteId,
            userId: req.user.id,
            tagCount: tags.length,
        });
        res.status(200).json({
            status: 'success',
            data: {
                tags
            }
        });
    } catch (err) {
        logger.error('Failed to add tags to note', {
            error: err.message,
            noteId: req.params.noteId,
            userId: req.user.id,
        });
        next(err);
    }
};

