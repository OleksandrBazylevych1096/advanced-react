import styles from "@/features/manageAddress/ui/ManageAddress.module.scss";

interface DisplayManageAddressProps {
    isLoading: boolean,
    isError: boolean,
    streetAddress?: string
}

export const DisplayManageAddress = (props: DisplayManageAddressProps) => {
    const {isLoading, streetAddress, isError} = props

    if (isLoading) return null;

    if (isError || !streetAddress) {
        return (
            <span className={styles.fallbackAddress}>
                Delivery Address
            </span>
        );
    }

    return (
        <span className={styles.address}>{streetAddress}</span>
    );

}