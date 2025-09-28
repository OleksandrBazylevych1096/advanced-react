import { baseAPI } from "@/shared/api";

const homePageApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getPromoBanners: build.query<string[], void>({
      query: () => "/promo-banners/active",
    }),
  }),
});

export const { useGetPromoBannersQuery } = homePageApi;
