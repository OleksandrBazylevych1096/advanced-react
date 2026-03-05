import styles from "./ManageShippingAddress.module.scss";

interface DisplayShippingAddressProps {
    isLoading: boolean;
    isError: boolean;
    streetAddress?: string;
}

export const DisplayShippingAddress = (props: DisplayShippingAddressProps) => {
    const {isLoading, streetAddress, isError} = props;

    if (isLoading) {
        return <span data-testid="manage-address-loading" />;
    }

    if (isError || !streetAddress) {
        return (
            <span className={styles.fallbackAddress} data-testid="manage-address-fallback">
                Delivery Address
            </span>
        );
    }

    return (
        <span className={styles.address} data-testid="manage-address-street">
            {streetAddress}
        </span>
    );
};
