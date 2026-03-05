import {useTranslation} from "react-i18next";

import {selectUserCurrency} from "@/entities/user";

import {createControllerResult, useAppSelector} from "@/shared/lib";

import {useGetFirstOrderProductsQuery} from "../../api/homePageApi";

export const useFirstOrderSectionController = () => {
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

    return createControllerResult({
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
    });
};
