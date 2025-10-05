import type { Category } from "@/entities/category";

import { baseAPI } from "@/shared/api";

interface Args {
  locale: string;
}

const categoryNavigationApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getTopLevelCategories: build.query<Category[], Args>({
      query: (params) => ({
        url: "/categories/top-level",
        params,
      }),
    }),
  }),
});

export const { useGetTopLevelCategoriesQuery } = categoryNavigationApi;
