import type {Category} from "@/entities/category";

const createMockCategory = (overrides?: Partial<Category>): Category => ({
    id: "cat-1",
    slug: "fruits",
    name: "Fruits",
    parentId: null,
    slugMap: {
        en: "fruits",
        de: "fruits",
    },
    ...overrides,
});

export const mockRootCategory: Category = createMockCategory({
    id: "0",
    slug: "all",
    name: "All Categories",
    slugMap: {en: "all", de: "alle"},
});

export const mockFruitsCategory: Category = createMockCategory({
    id: "1",
    slug: "fruits",
    name: "Fruits",
    slugMap: {en: "fruits", de: "obst"},
    parentId: null,
});

export const mockApplesCategory: Category = createMockCategory({
    id: "11",
    parentId: "1",
    slug: "apples",
    name: "Apples",
    slugMap: {en: "apples", de: "apfel"},
});

export const mockCategoryNavigationItems: Category[] = [
    mockFruitsCategory,
    createMockCategory({
        id: "2",
        slug: "vegetables",
        name: "Vegetables",
        slugMap: {en: "vegetables", de: "gemuse"},
    }),
    createMockCategory({
        id: "3",
        slug: "dairy",
        name: "Dairy",
        slugMap: {en: "dairy", de: "milchprodukte"},
    }),
    createMockCategory({
        id: "4",
        slug: "bakery",
        name: "Bakery",
        slugMap: {en: "bakery", de: "backerei"},
    }),
];

const subcategoryData: Category[] = [
    {
        id: "11",
        parentId: "1",
        slug: "apples",
        name: "Apples",
        slugMap: {en: "apples", de: "apfel"},
    },
    {
        id: "12",
        parentId: "1",
        slug: "bananas",
        name: "Bananas",
        slugMap: {en: "bananas", de: "bananen"},
    },
    {
        id: "13",
        parentId: "1",
        slug: "oranges",
        name: "Oranges",
        slugMap: {en: "oranges", de: "orangen"},
    },
    {
        id: "14",
        parentId: "1",
        slug: "berries",
        name: "Berries",
        slugMap: {en: "berries", de: "beeren"},
    },
];

export const mockFruitsSubcategories: Category[] = subcategoryData.map(createMockCategory);

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
