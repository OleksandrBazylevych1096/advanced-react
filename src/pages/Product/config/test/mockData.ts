import type {Product} from "@/entities/product";

export const mockProductPageProduct: Product = {
    id: "prod-1",
    name: "Organic Bananas",
    description: "Fresh and organic produce straight from local farms",
    shortDescription: "Fresh quality groceries",
    slug: "organic-bananas",
    stock: 25,
    price: 12,
    images: [{url: "https://via.placeholder.com/300", alt: "Product image", isMain: true}],
    brand: "organic-valley",
    country: "Ukraine",
    categoryId: "cat-1",
    slugMap: {
        en: "organic-bananas",
        de: "organic-bananas",
    },
};
