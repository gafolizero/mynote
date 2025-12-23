const folderRepo = require('../repositories/folder.repo');
const AppError = require('../utils/appError');

class FolderService {
    async createFolder(userId, name, color) {
        return await folderRepo.create(userId, name, color);
    }

    async getFolders(userId) {
        return await folderRepo.findAllByUserId(userId);
    }

    async updateFolder(id, userId, updateData) {
        const folder = await folderRepo.update(id, userId, updateData);
        if (!folder) {
            throw new AppError('Folder not found or unauthorized', 404);
        }
        return folder;
    }

    async deleteFolder(id, userId) {
        const deleted = await folderRepo.delete(id, userId);
        if (!deleted) {
            throw new AppError('Folder not found or unauthorized', 404);
        }
        return true;
    }
}

module.exports = new FolderService();

