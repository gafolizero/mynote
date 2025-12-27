const folderService = require('../services/folder.service');

exports.createFolder = async (req, res, next) => {
    try {
        const folder = await folderService.createFolder(req.user.id, req.body.name, req.body.color);
        res.status(201).json({
            status: 'success',
            data: {
                folder
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllFolders = async (req, res, next) => {
    try {
        const folders = await folderService.getFolders(req.user.id);
        res.status(200).json({
            status: 'success',
            data: {
                folders
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateFolder = async (req, res, next) => {
    try {
        const folder = await folderService.updateFolder(req.params.id, req.user.id, req.body);
        res.status(200).json({
            status: 'success',
            data: {
                folder
            }
        });

    } catch (err) {
        next(err);
    }
};

exports.deleteFolder = async (req, res, next) => {
    try {
        await folderService.deleteFolder(req.params.id, req.user.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

