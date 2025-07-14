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
        closed_on: z.string().nullable(),
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
        matriculation_number: z.string(),
        title: z.string(),
        pseudonyms: z.array(z.string()).optional().default([])
    }),
});

const civilians = defineCollection({
    loader: glob({ pattern: "./*.json", base: "./src/content/civilians" }),
    schema: z.object({
        name: z.string(),
        status: z.string(),
        professions: z.array(z.string()),
        birth_date: z.string().nullable(),
        pseudonyms: z.array(z.string()).optional().default([])
    }),
});

const affiliations = defineCollection({
    loader: glob({ pattern: "./*.json", base: "./src/content/affiliations" }),
    schema: z.object({
        name: z.string(),
        description: z.string(),
        kinds: z.array(z.string()),
        members: z.array(z.string()).optional().default([]),
        linked_individuals: z.array(z.string()).optional().default([])
    }),
});

const groups = defineCollection({
    loader: glob({ pattern: "./*.json", base: "./src/content/groups" }),
    schema: z.object({
        name: z.string(),
        parent: z.string().nullable(),
        description: z.string().nullable(),
        leader: z.string().nullable(),
        members: z.array(z.string()).optional().default([])
    })
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { cases, personal, civilians, affiliations, groups };
