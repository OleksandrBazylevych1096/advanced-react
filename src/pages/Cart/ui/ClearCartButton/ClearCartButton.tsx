import {useTranslation} from "react-i18next";

import {useClearCart} from "@/pages/Cart/model/controllers/useClearCart.ts";

import {Button} from "@/shared/ui/Button";

import styles from "./ClearCartButton.module.scss";

export const ClearCartButton = () => {
    const {t} = useTranslation();
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
            {t("cart.clear")}
        </Button>
    );
};
