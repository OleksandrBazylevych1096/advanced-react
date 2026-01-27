import type {Product} from "@/entities/product";

export const mockFacets = {
    countries: [
        {value: 'USA', label: 'USA', count: 45},
        {value: 'China', label: 'China', count: 32},
        {value: 'Germany', label: 'Germany', count: 28},
        {value: 'Japan', label: 'Japan', count: 15},
    ],
    brands: [
        {value: 'apple', label: 'Apple', count: 23},
        {value: 'samsung', label: 'Samsung', count: 18},
        {value: 'sony', label: 'Sony', count: 12},
        {value: 'lg', label: 'LG', count: 9},
    ],
    priceRange: {
        min: 100,
        max: 5000,
    },
};


export const mockProducts: Product[] = Array.from({length: 50}).map((_, index) => ({
    id: String(index),
    name: `iPhone 15 Pro ${index}`,
    description: 'jksskskskskks',
    shortDescription: 'dkdkkdkdkdkdkd',
    slug: 'skskskks',
    stock: 99,
    price: 999,
    images: [{url: 'https://via.placeholder.com/300', alt: 'image', isMain: true}],
    brand: 'apple',
    country: 'USA',
}))

export const emptyFacets = {
    countries: [],
    brands: [],
    priceRange: {min: 0, max: 0},
};