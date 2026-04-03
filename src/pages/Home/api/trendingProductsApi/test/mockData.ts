import {createMockFactory, sequence} from "@/shared/lib/testing";

import type {Tag} from "../../../model/types/Tag";

const tagNames = ["Organic", "Fresh", "Sale", "New", "Local", "Vegan", "Gluten-Free"];
const tagSlugs = ["organic", "fresh", "sale", "new", "local", "vegan", "gluten-free"];

export const createMockTag = createMockFactory<Tag>({
    id: sequence("tag"),
    slug: (i) => tagSlugs[i % tagSlugs.length],
    name: (i) => tagNames[i % tagNames.length],
});

export const mockTags = createMockTag.createList(5);
