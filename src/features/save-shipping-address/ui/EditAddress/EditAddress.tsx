import {Modal} from "@/shared/ui/Modal";

import {EditAddressForm} from "../EditAddressForm/EditAddressForm";
import {Map} from "../Map/Map";

const EditAddress = () => {
    return (
        <Modal.Body>
            <Map />
            <EditAddressForm />
        </Modal.Body>
    );
};

export default EditAddress;
