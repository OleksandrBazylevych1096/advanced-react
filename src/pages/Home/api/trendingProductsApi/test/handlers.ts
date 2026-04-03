import {API_URL} from "@/shared/config";
import {createHandlers} from "@/shared/lib/testing";

import {mockTags} from "./mockData";

export const trendingProductsHandlers = createHandlers({
    endpoint: `${API_URL}/tags/popular`,
    method: "get",
    defaultData: mockTags,
    errorData: {error: "Failed to load trending products"},
    errorStatus: 500,
});
