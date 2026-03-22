import {useGetCategoryBreadcrumbsQuery, useGetCategoryBySlugQuery} from "./api/categoryApi";
import {categoryBreadcrumbsHandlers, categoryHandlers} from "./api/test/handlers";
import {useResolvedCategoryIdController} from "./state/controllers/useResolvedCategoryIdController";
import type {BaseCategory, Category} from "./state/types/Category";

export {useGetCategoryBySlugQuery};
export {useGetCategoryBreadcrumbsQuery};
export {useResolvedCategoryIdController};
export type {BaseCategory, Category};

// Test-only exports
export {categoryHandlers};
export {categoryBreadcrumbsHandlers};

