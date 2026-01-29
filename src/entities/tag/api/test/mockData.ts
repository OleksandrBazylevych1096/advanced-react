import type {Tag} from "@/entities/tag";

import {createMockFactory, sequence} from "@/shared/lib/test/createMockFactories.ts";

const tagNames = ['Organic', 'Fresh', 'Sale', 'New', 'Local', 'Vegan', 'Gluten-Free'];
const tagSlugs = ['organic', 'fresh', 'sale', 'new', 'local', 'vegan', 'gluten-free'];

export const createMockTag = createMockFactory<Tag>({
    id: sequence('tag'),
    slug: (i) => tagSlugs[i % tagSlugs.length],
    name: (i) => tagNames[i % tagNames.length],
});


export const mockTags = createMockTag.createList(5);