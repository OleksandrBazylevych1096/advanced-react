export interface Category extends BaseCategory {
    icon?: string;
    children?: Category[]
}


export interface BaseCategory {
    id: string;
    name: string;
    slug: string;
}