import type {SupportedLngsType} from "@/shared/config";

export interface Category extends BaseCategory {
    icon?: string;
    children?: Category[]
    parentId: string | null
}


export interface BaseCategory {
    id: string;
    name: string;
    slug: string
    slugMap: Record<SupportedLngsType, string>;
}