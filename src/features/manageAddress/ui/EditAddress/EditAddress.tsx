import { Modal } from "@/shared/ui";

import { Map } from "../Map/Map";

import { EditAddressForm } from "./EditAddressForm/EditAddressForm";

const EditAddress = () => {
  return (
    <Modal.Body>
      <Map />
      <EditAddressForm />
    </Modal.Body>
  );
};

export default EditAddress;
