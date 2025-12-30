const tagRepo = require('../repositories/tag.repo');
const noteRepo = require('../repositories/note.repo');
const AppError = require('../utils/appError');

class TagService {
    async createTag(userId, name) {
        try {
            return await tagRepo.create(userId, name);
        } catch (error) {
            if (error.code === '23505') {
                throw new AppError('A tag with this name already exists', 400);
            }
            throw error;
        }
    }

    async getTags(userId) {
        return await tagRepo.findAllByUserId(userId);
    }

    async addTagsToNote(userId, noteId, tagIds) {
        const note = await noteRepo.findById(noteId, userId);
        if (!note) throw new AppError('Note not found', 404);

        await tagRepo.linkTagsToNote(noteId, tagIds);
        return await tagRepo.findTagsByNoteId(noteId);
    }
}

module.exports = new TagService();

