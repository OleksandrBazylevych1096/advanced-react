import {useTranslation} from "react-i18next";

import {useProductSearchController} from "@/features/product-search/model/controllers/useProductSearchController";

import SearchIcon from "@/shared/assets/icons/Search.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Input} from "@/shared/ui/Input";

import {ProductSearchDropdown} from "./ProductSearchDropdown/ProductSearchDropdown";

export const ProductSearch = () => {
    const {t} = useTranslation();
    const {
        data: {query, suggestions, showSuggestionsDropdown},
        status: {isFetchingSuggestions, hasNoSuggestions},
        actions: {setQuery, onFocusInput, onKeyDown, openProductPage},
    } = useProductSearchController();

    return (
        <>
            <Input
                fullWidth
                rounded
                value={query}
                onChange={setQuery}
                onFocus={onFocusInput}
                onKeyDown={onKeyDown}
                placeholder={t("header.searchBy")}
                Icon={<AppIcon size={18} Icon={SearchIcon} theme="background" />}
                data-testid="header-product-search-input"
            />

            {showSuggestionsDropdown && (
                <ProductSearchDropdown
                    suggestions={suggestions}
                    isFetchingSuggestions={isFetchingSuggestions}
                    hasNoSuggestions={hasNoSuggestions}
                    onOpenProduct={openProductPage}
                />
            )}
        </>
    );
};
