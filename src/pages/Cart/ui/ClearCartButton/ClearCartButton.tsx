import {useClearCart} from "@/pages/Cart/model/controllers/useClearCart.ts";

import {Button} from "@/shared/ui/Button";

import styles from "./ClearCartButton.module.scss";

export const ClearCartButton = () => {
    const {
        status: {isClearing},
        actions: {clearCart},
    } = useClearCart();
    return (
        <Button
            theme="ghost"
            size="sm"
            onClick={clearCart}
            isLoading={isClearing}
            className={styles.clearBtn}
        >
            Clear Cart
        </Button>
    );
};
