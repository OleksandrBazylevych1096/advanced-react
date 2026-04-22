import type {SupportedLngsType} from "@/shared/config";

export interface Tag {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    productCount?: number;
    slugMap: Record<SupportedLngsType, string>;
}
