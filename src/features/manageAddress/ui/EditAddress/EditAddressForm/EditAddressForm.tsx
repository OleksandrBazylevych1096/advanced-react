import {useTranslation} from "react-i18next";

import {useEditAddressForm} from "@/features/manageAddress/lib/useEditAddressForm.ts";

import {Button, Input} from "@/shared/ui";

import styles from "./EditAddressForm.module.scss";
import {SuggestionsList} from "./SuggestionList";

export const EditAddressForm = () => {
    const {t} = useTranslation()
    const {
        handleSubmit,
        handleCityFocus,
        handleStreetFocus,
        handleStreetBlur,
        handleCityChange,
        handleApartmentChange,
        handleCityBlur,
        handleStreetAddressChange,
        handleZipCodeChange,
        streetAddress,
        streetSuggestions,
        handleSuggestionClick,
        showStreetSuggestions,
        numberOfApartment,
        zipCode,
        city,
        citySuggestions,
        mode,
        showCitySuggestions,
        isSubmitting,
        canSave
    } = useEditAddressForm()
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
                <Input
                    label={t("manageAddress.streetAddress")}
                    value={streetAddress}
                    onChange={handleStreetAddressChange}
                    onFocus={handleStreetFocus}
                    onBlur={handleStreetBlur}
                    required
                />
                <SuggestionsList
                    suggestions={streetSuggestions}
                    show={showStreetSuggestions}
                    onSelect={(s) => handleSuggestionClick(s, "street")}
                />
            </div>

            <div className={styles.containerWrapper}>
                <div className={styles.container}>
                    <div className={styles.detailsInput}>
                        <Input
                            label={t("manageAddress.city")}
                            value={city}
                            onChange={handleCityChange}
                            onFocus={handleCityFocus}
                            onBlur={handleCityBlur}
                            required
                        />
                    </div>
                    <div className={styles.detailsInput}>
                        <Input
                            label={t("manageAddress.apartment")}
                            value={numberOfApartment}
                            onChange={handleApartmentChange}
                            required
                        />
                    </div>
                    <div className={styles.detailsInput}>
                        <Input
                            label={t("manageAddress.zipCode")}
                            value={zipCode}
                            onChange={handleZipCodeChange}
                            required
                        />
                    </div>
                </div>

                <SuggestionsList
                    suggestions={citySuggestions}
                    show={showCitySuggestions}
                    onSelect={(s) => handleSuggestionClick(s, "city")}
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
