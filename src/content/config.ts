import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        date: z.date().optional(),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
    }),
});

const projectsCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        thumbnail: z.string().optional(),
        live: z.string().url().optional().nullable(),
        github: z.string().url().optional().nullable(),
        tech: z.array(z.string()).optional(),
        position: z.number().optional(),
    }),
});

const experiencesCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        role: z.string(),
        from: z.string(),
        to: z.string(),
        skills: z.string().optional(),
        link: z.string().optional().nullable(),
        timeline: z.string().optional(),
    }),
});

const resourcesCollection = defineCollection({
    type: 'data',
    schema: z.array(z.object({
        text: z.string(),
        link: z.string(),
    })),
});

export const collections = {
    'posts': postsCollection,
    'projects': projectsCollection,
    'experiences': experiencesCollection,
    'resources': resourcesCollection,
};


