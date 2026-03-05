import {createApi} from "@reduxjs/toolkit/query/react";

import {baseQueryWithReauth} from "./baseQueryWithReauth";

export const baseAPI = createApi({
    baseQuery: baseQueryWithReauth,
    reducerPath: "baseAPI",
    tagTypes: ["Product", "ShippingAddress", "Cart", "CartValidation", "UserSession"],
    endpoints: () => ({}),
});
