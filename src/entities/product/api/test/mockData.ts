import {createMockFactory, sequence} from "@/shared/lib/test/createMockFactories.ts";

import type {Product, ProductFacets} from '../../model/types/Product.ts';

export const mockProductNames = [
    'Organic Bananas', 'Fresh Milk', 'Whole Wheat Bread', 'Chicken Breast',
    'Greek Yogurt', 'Red Apples', 'Cheddar Cheese', 'Fresh Salmon',
    'Avocados', 'Orange Juice', 'Eggs Free Range', 'Butter Unsalted',
    'Tomatoes', 'Ground Beef', 'Pasta Spaghetti', 'Olive Oil Extra Virgin',
    'Rice Basmati', 'Honey Natural', 'Oatmeal Organic', 'Carrots Fresh'
];

export const mockProductDescriptions = [
    'Fresh and organic produce straight from local farms',
    'Premium quality dairy products for your healthy lifestyle',
    'Freshly baked goods made with natural ingredients',
    'High-protein meat products from trusted suppliers',
];

export const mockProductCountries = ['Ukraine', 'Poland', 'Netherlands', 'Italy', 'Spain']

export const mockProductBrands = ['organic-valley', 'nestle', 'kraft', 'dannon', 'tyson', 'del-monte']

export const createMockProduct = createMockFactory<Product>({
    id: sequence('prod'),
    name: (i) => mockProductNames[i % mockProductNames.length],
    description: (i) => mockProductDescriptions[i % mockProductDescriptions.length],
    shortDescription: 'Fresh quality groceries',
    slug: (i) => mockProductNames[i % mockProductNames.length].toLowerCase().replace(/\s+/g, '-'),
    stock: (i) => 10 + (i * 15) % 190, // Deterministic values between 10-200
    price: (i) => 1 + (i * 7) % 50, // Deterministic values between 1-50
    images: [{url: 'https://via.placeholder.com/300', alt: 'Product image', isMain: true}],
    brand: (i) => mockProductBrands[i % mockProductBrands.length],
    country: (i) => mockProductCountries[i % mockProductCountries.length],
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