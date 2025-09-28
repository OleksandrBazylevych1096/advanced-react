interface ProductImage {
  url: string;
  alt: string;
  isMain: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  slug: string;
  price: number;
  oldPrice?: number;
  stock: number;
  images: ProductImage[];
}

export interface ProductsApiResponse {
  products: Product[];
  total: number;
}
