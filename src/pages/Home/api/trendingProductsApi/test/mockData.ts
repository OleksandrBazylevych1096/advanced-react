import type {Tag} from "@/entities/tag";

import {createMockFactory, sequence} from "@/shared/lib/testing";

const tagNames = ["Organic", "Fresh", "Sale", "New", "Local", "Vegan", "Gluten-Free"];
const tagSlugs = ["organic", "fresh", "sale", "new", "local", "vegan", "gluten-free"];

export const createMockTag = createMockFactory<Tag>({
    id: sequence("tag"),
    slug: (i) => tagSlugs[i % tagSlugs.length],
    name: (i) => tagNames[i % tagNames.length],
    slugMap: (i) => ({
        en: tagSlugs[i % tagSlugs.length],
        de: tagSlugs[i % tagSlugs.length],
    }),
});

export const mockTags = createMockTag.createList(5);
