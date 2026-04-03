import {useTranslation} from "react-i18next";

import {selectUserCurrency} from "@/entities/user";

import {useAppSelector} from "@/shared/lib/state";

import {useGetFirstOrderProductsQuery} from "../../api/homePageApi";

export const useFirstOrderSection = () => {
    const {i18n} = useTranslation();
    const currency = useAppSelector(selectUserCurrency);

    const {
        data: products,
        isFetching,
        isError,
        refetch,
    } = useGetFirstOrderProductsQuery({
        locale: i18n.language,
        currency,
    });

    const retry = () => {
        refetch();
    };

    return {
        data: {
            products,
            currency,
        },
        status: {
            isFetching,
            isError,
        },
        actions: {
            retry,
        },
    };
};
