import {type FormEvent} from "react";
import {useTranslation} from "react-i18next";

import type {AddressMode, AddressSearchResult} from "@/features/manageAddress/model/types/Address.ts";

import {Button, Input} from "@/shared/ui";

import styles from "./EditAddressForm.module.scss";
import {SuggestionsList} from "./SuggestionList";

export interface EditAddressFormUIProps {
    streetAddress: string;
    city: string;
    numberOfApartment: string;
    zipCode: string;
    streetSuggestions?: AddressSearchResult[];
    citySuggestions?: AddressSearchResult[];
    showStreetSuggestions: boolean;
    showCitySuggestions: boolean;
    isSubmitting?: boolean;
    canSave?: boolean;
    mode: AddressMode;
    onSubmit: (e: FormEvent) => void;
    onStreetAddressChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onApartmentChange: (value: string) => void;
    onZipCodeChange: (value: string) => void;
    onStreetFocus: () => void;
    onStreetBlur: () => void;
    onCityFocus: () => void;
    onCityBlur: () => void;
    onSuggestionClick: (suggestion: AddressSearchResult, type: "street" | "city") => void;
}

export const EditAddressFormView = ({
                                        streetAddress,
                                        city,
                                        numberOfApartment,
                                        zipCode,
                                        streetSuggestions,
                                        citySuggestions,
                                        showStreetSuggestions,
                                        showCitySuggestions,
                                        isSubmitting = false,
                                        canSave = false,
                                        mode,
                                        onSubmit,
                                        onStreetAddressChange,
                                        onCityChange,
                                        onApartmentChange,
                                        onZipCodeChange,
                                        onStreetFocus,
                                        onStreetBlur,
                                        onCityFocus,
                                        onCityBlur,
                                        onSuggestionClick,
                                    }: EditAddressFormUIProps) => {
    const {t} = useTranslation();
    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.inputWrapper}>
                <Input
                    label={t("manageAddress.streetAddress")}
                    value={streetAddress}
                    onChange={onStreetAddressChange}
                    onFocus={onStreetFocus}
                    onBlur={onStreetBlur}
                    required
                />
                <SuggestionsList
                    suggestions={streetSuggestions}
                    show={showStreetSuggestions}
                    onSelect={(s) => onSuggestionClick(s, "street")}
                />
            </div>

            <div className={styles.containerWrapper}>
                <div className={styles.container}>
                    <div className={styles.detailsInput}>
                        <Input
                            label={t("manageAddress.city")}
                            value={city}
                            onChange={onCityChange}
                            onFocus={onCityFocus}
                            onBlur={onCityBlur}
                            required
                        />
                    </div>
                    <div className={styles.detailsInput}>
                        <Input
                            label={t("manageAddress.apartment")}
                            value={numberOfApartment}
                            onChange={onApartmentChange}
                            required
                        />
                    </div>
                    <div className={styles.detailsInput}>
                        <Input
                            label={t("manageAddress.zipCode")}
                            value={zipCode}
                            onChange={onZipCodeChange}
                            required
                        />
                    </div>
                </div>

                <SuggestionsList
                    suggestions={citySuggestions}
                    show={showCitySuggestions}
                    onSelect={(s) => onSuggestionClick(s, "city")}
                />
            </div>

            <Button
                isLoading={isSubmitting}
                disabled={!canSave || isSubmitting}
                fullWidth
                type="submit"
            >
                {mode === "edit" ? t("manageAddress.update") : t("manageAddress.save")}
            </Button>
        </form>
    );
};