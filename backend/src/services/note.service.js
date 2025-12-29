const noteRepo = require('../repositories/note.repo');
const AppError = require('../utils/appError');

class NoteService {
    async createNote(userId, data) {
        return await noteRepo.create(userId, data);
    }

    async getAllNotes(userId, filters) {
        return await noteRepo.findAll(userId, {
            folder_id: filters.folder_id,
            isPinned: filters.isPinned,
            isArchived: filters.isArchived,
            search: filters.search,
            tagId: filters.tagId,
            page: filters.page,
            limit: filters.limit,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder
        });
    }

    async getNote(id, userId) {
        const note = await noteRepo.findById(id, userId);
        if (!note) throw new AppError('Note not found', 404);
        return note;
    }

    async updateNote(id, userId, data) {
        const note = await noteRepo.update(id, userId, data);
        if (!note) throw new AppError('Note not found or unauthorized', 404);
        return note;
    }

    async deleteNote(id, userId) {
        const success = await noteRepo.delete(id, userId);
        if (!success) throw new AppError('Note not found or unauthorized', 404);
        return true;
    }
}

module.exports = new NoteService();

