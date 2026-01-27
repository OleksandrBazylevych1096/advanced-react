import type {Tag} from "@/entities/tag";

export const mockTags: Tag[] = Array.from({length: 20}).map((_, index) => ({
    id: String(index),
    slug: `slug${index}`,
    name: `tag ${index}`
}))
