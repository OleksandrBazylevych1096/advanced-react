import {EditAddressFormView} from "./EditAddressFormView";
import {useSaveShippingAddressForm} from "./useSaveShippingAddressForm/useSaveShippingAddressForm.ts";

export const EditAddressForm = () => {
    const {data, derived, status, actions} = useSaveShippingAddressForm();

    return (
        <EditAddressFormView
            streetAddress={data.streetAddress}
            city={data.city}
            numberOfApartment={data.numberOfApartment}
            zipCode={data.zipCode}
            streetSuggestions={data.streetSuggestions}
            citySuggestions={data.citySuggestions}
            showStreetSuggestions={data.showStreetSuggestions}
            showCitySuggestions={data.showCitySuggestions}
            isSubmitting={status.isSubmitting}
            canSave={derived.canSave}
            mode={data.mode}
            onSubmit={actions.submitAddress}
            onStreetAddressChange={actions.changeStreetAddress}
            onCityChange={actions.changeCity}
            onApartmentChange={actions.changeApartment}
            onZipCodeChange={actions.changeZipCode}
            onStreetFocus={actions.focusStreet}
            onStreetBlur={actions.blurStreet}
            onCityFocus={actions.focusCity}
            onCityBlur={actions.blurCity}
            onSuggestionClick={actions.selectSuggestion}
        />
    );
};
