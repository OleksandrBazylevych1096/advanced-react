import {createMockFactory, sequence} from "@/shared/lib/test/createMockFactories.ts";

import type {Category} from '../../model/types/Category.ts';

const categoryNames = ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery', 'Beverages'];
const categorySlugs = ['fruits', 'vegetables', 'dairy', 'meat', 'bakery', 'beverages'];

export const createMockCategory = createMockFactory<Category>({
    id: sequence('cat'),
    slug: (i) => categorySlugs[i % categorySlugs.length],
    name: (i) => categoryNames[i % categoryNames.length],
    parentId: sequence('cat'),
    slugMap: (i) => ({
        en: categorySlugs[i % categorySlugs.length],
        de: categorySlugs[i % categorySlugs.length],
    }),
});


export const mockCategories = createMockCategory.createList(4);