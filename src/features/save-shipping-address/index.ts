import {ADDRESS_MODE_TITLES} from "./consts/defaults";
import {
    selectSaveShippingAddressMode,
    selectIsManageShippingAddressModalOpen,
    selectSaveShippingAddressCity,
    selectSaveShippingAddressId,
    selectSaveShippingAddressLocation,
    selectSaveShippingAddressNumberOfApartment,
    selectSaveShippingAddressStreetAddress,
    selectSaveShippingAddressZipCode,
} from "./model/selectors/saveShippingAddressSelectors";
import {
    saveShippingAddressActions,
    saveShippingAddressReducer,
} from "./model/slice/saveShippingAddressSlice";
import {EditAddressAsync} from "./ui/EditAddress/EditAddress.async";
import {InitializeEditModeButton} from "./ui/InitializeEditModeButton/InitializeEditModeButton";

export {
    EditAddressAsync,
    InitializeEditModeButton,
    saveShippingAddressActions,
    saveShippingAddressReducer,
    ADDRESS_MODE_TITLES,

    // Selectors
    selectSaveShippingAddressMode,
    selectIsManageShippingAddressModalOpen,
    selectSaveShippingAddressCity,
    selectSaveShippingAddressId,
    selectSaveShippingAddressLocation,
    selectSaveShippingAddressNumberOfApartment,
    selectSaveShippingAddressStreetAddress,
    selectSaveShippingAddressZipCode,
};
