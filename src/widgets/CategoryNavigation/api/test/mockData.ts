import type {Category} from '@/entities/category';

import {createMockFactory, sequence} from "@/shared/lib/test/createMockFactories.ts";

const categoryNames = ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery'];
const categorySlugs = ['fruits', 'vegetables', 'dairy', 'meat', 'bakery'];

const createCategory = createMockFactory<Category>({
    id: sequence('category'),
    parentId: null,
    slug: (i) => categorySlugs[i % categorySlugs.length],
    name: (i) => categoryNames[i % categoryNames.length],
    slugMap: (i) => ({
        en: categorySlugs[i % categorySlugs.length],
        de: categorySlugs[i % categorySlugs.length],
    }),
});

export const mockRootCategory: Category = createCategory({
    id: '0',
    slug: 'all',
    name: 'All Categories',
    slugMap: {en: 'all', de: 'alle'},
});

export const mockFruitsCategory: Category = createCategory({
    id: '1',
    slug: 'fruits',
    name: 'Fruits',
    slugMap: {en: 'fruits', de: 'obst'},
});

export const mockApplesCategory: Category = createCategory({
    id: '11',
    parentId: '1',
    slug: 'apples',
    name: 'Apples',
    slugMap: {en: 'apples', de: 'apfel'},
});

export const mockCategoryNavigationItems: Category[] = createCategory.createList(5);

const subcategoryData: Category[] = [
    {
        id: '11',
        parentId: '1',
        slug: 'apples',
        name: 'Apples',
        slugMap: {en: 'apples', de: 'apfel'},
    },
    {
        id: '12',
        parentId: '1',
        slug: 'bananas',
        name: 'Bananas',
        slugMap: {en: 'bananas', de: 'bananen'},
    },
    {
        id: '13',
        parentId: '1',
        slug: 'oranges',
        name: 'Oranges',
        slugMap: {en: 'oranges', de: 'orangen'},
    },
    {
        id: '14',
        parentId: '1',
        slug: 'berries',
        name: 'Berries',
        slugMap: {en: 'berries', de: 'beeren'},
    },
];

export const mockFruitsSubcategories: Category[] = subcategoryData.map(createCategory);


export const mockCategoryNavigation = {
    topLevel: {
        currentCategory: mockRootCategory,
        parentCategory: mockRootCategory,
        items: mockCategoryNavigationItems,
        isShowingSubcategories: false,
    },

    withSubcategories: {
        currentCategory: mockFruitsCategory,
        parentCategory: mockRootCategory,
        items: mockFruitsSubcategories,
        isShowingSubcategories: true,
    },

    empty: {
        currentCategory: mockRootCategory,
        parentCategory: mockRootCategory,
        items: [],
        isShowingSubcategories: false,
    },
};


export const mockElectronicsSubcategories = mockFruitsSubcategories;