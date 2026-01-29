import {createMockFactory, random, sequence} from "@/shared/lib/test/createMockFactories.ts";

import type {Product, ProductFacets} from '../../model/types/Product.ts';

const productNames = [
    'Organic Bananas', 'Fresh Milk', 'Whole Wheat Bread', 'Chicken Breast',
    'Greek Yogurt', 'Red Apples', 'Cheddar Cheese', 'Fresh Salmon',
    'Avocados', 'Orange Juice', 'Eggs Free Range', 'Butter Unsalted',
    'Tomatoes', 'Ground Beef', 'Pasta Spaghetti', 'Olive Oil Extra Virgin',
    'Rice Basmati', 'Honey Natural', 'Oatmeal Organic', 'Carrots Fresh'
];

const productDescriptions = [
    'Fresh and organic produce straight from local farms',
    'Premium quality dairy products for your healthy lifestyle',
    'Freshly baked goods made with natural ingredients',
    'High-protein meat products from trusted suppliers',
];

export const createMockProduct = createMockFactory<Product>({
    id: sequence('prod'),
    name: (i) => productNames[i % productNames.length],
    description: (i) => productDescriptions[i % productDescriptions.length],
    shortDescription: 'Fresh quality groceries',
    slug: (i) => productNames[i % productNames.length].toLowerCase().replace(/\s+/g, '-'),
    stock: () => random.int(0, 200),
    price: () => random.int(1, 50),
    images: [{url: 'https://via.placeholder.com/300', alt: 'Product image', isMain: true}],
    brand: random.oneOf(['organic-valley', 'nestle', 'kraft', 'dannon', 'tyson', 'del-monte']),
    country: random.oneOf(['Ukraine', 'Poland', 'Netherlands', 'Italy', 'Spain']),
});

export const createMockFacets = (): ProductFacets => ({
    countries: [
        {value: 'Ukraine', label: 'Ukraine', count: 45},
        {value: 'Poland', label: 'Poland', count: 32},
        {value: 'Netherlands', label: 'Netherlands', count: 28},
        {value: 'Italy', label: 'Italy', count: 20},
        {value: 'Spain', label: 'Spain', count: 15},
    ],
    brands: [
        {value: 'organic-valley', label: 'Organic Valley', count: 23},
        {value: 'nestle', label: 'Nestlé', count: 18},
        {value: 'kraft', label: 'Kraft', count: 15},
        {value: 'dannon', label: 'Dannon', count: 12},
        {value: 'tyson', label: 'Tyson', count: 10},
        {value: 'del-monte', label: 'Del Monte', count: 8},
    ],
    priceRange: {
        min: 1,
        max: 100,
    },
});


export const mockFacets = createMockFacets();

export const mockProducts: Product[] = createMockProduct.createList(20);

export const emptyFacets: ProductFacets = {
    countries: [],
    brands: [],
    priceRange: {min: 0, max: 0},
};