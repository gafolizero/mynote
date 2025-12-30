const folderService = require('../services/folder.service');
const logger = require('../utils/logger');

exports.createFolder = async (req, res, next) => {
    try {
        const folder = await folderService.createFolder(req.user.id, req.body.name, req.body.color);
        logger.info('Folder created', {
            folderId: folder.id,
            userId: req.user.id,
            name: folder.name,
        });
        res.status(201).json({
            status: 'success',
            data: {
                folder
            }
        });
    } catch (err) {
        logger.error('Failed to create folder', {
            error: err.message,
            userId: req.user.id,
        });
        next(err);
    }
};

exports.getAllFolders = async (req, res, next) => {
    try {
        const folders = await folderService.getFolders(req.user.id);
        logger.debug('Folders retrieved', {
            userId: req.user.id,
            count: folders.length,
        });
        res.status(200).json({
            status: 'success',
            data: {
                folders
            }
        });
    } catch (err) {
        logger.error('Failed to get folders', {
            error: err.message,
            userId: req.user.id,
        });
        next(err);
    }
};

exports.updateFolder = async (req, res, next) => {
    try {
        const folder = await folderService.updateFolder(req.params.id, req.user.id, req.body);
        logger.info('Folder updated', {
            folderId: req.params.id,
            userId: req.user.id,
            name: folder.name,
        });
        res.status(200).json({
            status: 'success',
            data: {
                folder
            }
        });

    } catch (err) {
        logger.error('Failed to update folder', {
            error: err.message,
            folderId: req.params.id,
            userId: req.user.id,
        });
        next(err);
    }
};

exports.deleteFolder = async (req, res, next) => {
    try {
        await folderService.deleteFolder(req.params.id, req.user.id);
        logger.info('Folder deleted', {
            folderId: req.params.id,
            userId: req.user.id,
        });
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        logger.error('Failed to delete folder', {
            error: err.message,
            folderId: req.params.id,
            userId: req.user.id,
        });
        next(err);
    }
};

