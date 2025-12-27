const { z } = require('zod');

const noteSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(255),
        content: z.string().optional(),
        folder_id: z.number().int().positive().nullable().optional(),
        is_pinned: z.boolean().optional(),
        is_archived: z.boolean().optional(),
    }),
});

module.exports = { noteSchema };

