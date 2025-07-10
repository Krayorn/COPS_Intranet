// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob } from 'astro/loaders';

// 3. Define your collection(s)
const cases = defineCollection({
    loader: glob({ pattern: "./*.json", base: "./src/content/cases" }),
    schema: z.object({
        case_number: z.string(),
        name: z.string(),
        opened_on: z.string(),
        closed_on: z.string(),
        status: z.string(),
        priority_detective: z.string(),
        persons_of_interest: z.array(z.string()).optional().default([]),
        assigned_personnel: z.array(z.string()).optional().default([])
    }),
});

const personal = defineCollection({
    loader: glob({ pattern: "./*.json", base: "./src/content/personal" }),
    schema: z.object({
        name: z.string(),
        rank: z.string(),
        joined_on: z.string(),
        status: z.string(),
        department: z.string(),
        matriculation_number: z.string()
    }),
});

const civilians = defineCollection({
    loader: glob({ pattern: "./*.json", base: "./src/content/civilians" }),
    schema: z.object({
        name: z.string(),
        status: z.string(),
        affiliations: z.array(z.string()),
        professions: z.array(z.string()),
        birth_date: z.string().nullable()
    }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { cases, personal, civilians };
