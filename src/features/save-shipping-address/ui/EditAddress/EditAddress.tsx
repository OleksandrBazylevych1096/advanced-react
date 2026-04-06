import {Box} from "@/shared/ui/Box";

import {EditAddressForm} from "../EditAddressForm/EditAddressForm";
import {Map} from "../Map/Map";

const EditAddress = () => {
    return (
        <Box>
            <Map />
            <EditAddressForm />
        </Box>
    );
};

export default EditAddress;
