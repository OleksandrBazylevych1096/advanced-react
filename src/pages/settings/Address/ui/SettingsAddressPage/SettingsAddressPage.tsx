import {ManageShippingAddress} from "@/widgets/ManageShippingAddress";

import {saveShippingAddressReducer} from "@/features/save-shipping-address";

import {DynamicModuleLoader} from "@/shared/lib/state";
import {Stack} from "@/shared/ui/Stack";

const reducers = {
    saveShippingAddress: saveShippingAddressReducer,
};

const SettingsAddressPage = () => {
    return (
        <DynamicModuleLoader reducers={reducers}>
            <Stack gap={16}>
                <ManageShippingAddress />
            </Stack>
        </DynamicModuleLoader>
    );
};

export default SettingsAddressPage;
