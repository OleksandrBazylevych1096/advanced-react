import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_URL } from "@/shared/config";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
});

export const baseAPI = createApi({
  baseQuery,
  reducerPath: "baseAPI",
  endpoints: () => ({}),
});
