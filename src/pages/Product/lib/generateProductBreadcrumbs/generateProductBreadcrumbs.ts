import type {BreadcrumbItem} from "@/shared/ui/Breadcrumbs/Breadcrumbs.tsx";

export const generateProductBreadcrumbs = (
    categoryBreadcrumb: BreadcrumbItem[] | undefined,
    productName: string | undefined,
) => {
    if (!categoryBreadcrumb || !productName) return [];

    return [...categoryBreadcrumb, {label: productName}];
};
