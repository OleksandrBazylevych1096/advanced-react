import {useEffect, useRef} from "react";

import {
    productSearchActions,
    selectProductSearchShowHistoryDropdown,
} from "@/features/product-search";

import {useAppDispatch, useAppSelector} from "@/shared/lib/state";

export const useSearchPanel = () => {
    const dispatch = useAppDispatch();
    const containerRef = useRef<HTMLDivElement>(null);
    const showHistoryDropdown = useAppSelector(selectProductSearchShowHistoryDropdown);

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                dispatch(productSearchActions.setFocused(false));
            }
        };

        document.addEventListener("mousedown", closeOnOutsideClick);

        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick);
        };
    }, [dispatch]);

    return {
        data: {
            containerRef,
            showHistoryDropdown,
        },
    };
};
