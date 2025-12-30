const { z } = require('zod');

const noteSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(255, 'Title must not exceed 255 characters'),
        content: z.string().optional(),
        folder_id: z.number().int().positive().nullable().optional(),
        is_pinned: z.boolean().optional(),
        is_archived: z.boolean().optional(),
        tagIds: z.array(z.number().int().positive()).optional(),
    }),
});

const updateNoteSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title cannot be empty').max(255, 'Title must not exceed 255 characters').optional(),
        content: z.string().optional(),
        folder_id: z.number().int().positive().nullable().optional(),
        is_pinned: z.boolean().optional(),
        is_archived: z.boolean().optional(),
        tagIds: z.array(z.number().int().positive()).optional(),
    }),
});

module.exports = { noteSchema, updateNoteSchema };

