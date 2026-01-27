// EditAddressForm.tsx
import {useEditAddressForm} from "@/features/manageAddress/model/services/useEditAddressForm.ts";
import {EditAddressFormView} from "@/features/manageAddress/ui/EditAddress/EditAddressForm/EditAddressFormView.tsx";

export const EditAddressForm = () => {
    const formProps = useEditAddressForm();

    return (
        <EditAddressFormView
            streetAddress={formProps.streetAddress}
            city={formProps.city}
            numberOfApartment={formProps.numberOfApartment}
            zipCode={formProps.zipCode}
            streetSuggestions={formProps.streetSuggestions}
            citySuggestions={formProps.citySuggestions}
            showStreetSuggestions={formProps.showStreetSuggestions}
            showCitySuggestions={formProps.showCitySuggestions}
            isSubmitting={formProps.isSubmitting}
            canSave={formProps.canSave}
            mode={formProps.mode}
            onSubmit={formProps.handleSubmit}
            onStreetAddressChange={formProps.handleStreetAddressChange}
            onCityChange={formProps.handleCityChange}
            onApartmentChange={formProps.handleApartmentChange}
            onZipCodeChange={formProps.handleZipCodeChange}
            onStreetFocus={formProps.handleStreetFocus}
            onStreetBlur={formProps.handleStreetBlur}
            onCityFocus={formProps.handleCityFocus}
            onCityBlur={formProps.handleCityBlur}
            onSuggestionClick={formProps.handleSuggestionClick}
        />
    );
};