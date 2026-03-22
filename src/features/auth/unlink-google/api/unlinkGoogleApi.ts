import {baseAPI} from "@/shared/api";

type SuccessResponse = {success: true};

export const unlinkGoogleApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        unlinkGoogle: build.mutation<SuccessResponse, void>({
            query: () => ({
                url: "/auth/google/link",
                method: "DELETE",
            }),
            invalidatesTags: ["UserSession"],
        }),
    }),
});

export const {useUnlinkGoogleMutation} = unlinkGoogleApi;
