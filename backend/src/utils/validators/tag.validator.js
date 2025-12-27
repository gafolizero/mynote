const { z } = require('zod');

const tagSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Tag name is required').max(50).trim(),
    }),
});

const linkTagsSchema = z.object({
    body: z.object({
        tagIds: z.array(z.number().int()).min(1, 'At least one tag ID is required'),
    }),
});

module.exports = { tagSchema, linkTagsSchema };

