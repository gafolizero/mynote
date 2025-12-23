const { z } = require('zod');

const folderSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Folder name is required').max(100),
        color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color').optional(),
    }),
});

module.exports = { folderSchema };
