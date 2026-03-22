import {BestSellingProducts} from "@/widgets/BestSellingProducts";

import {useCartController} from "@/entities/cart";
import {selectIsAuthenticated} from "@/entities/user";

import {useAppSelector} from "@/shared/lib/state";
import {Grid} from "@/shared/ui/Grid";
import {Stack} from "@/shared/ui/Stack";

import styles from "./CartPage.module.scss";
import {CartPageItemsSection} from "./CartPageItemsSection/CartPageItemsSection";
import {CartSummaryCard} from "./CartSummaryCard/CartSummaryCard";

const CartPage = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const {
        data: {cart},
        status: {isError},
    } = useCartController({isAuthenticated});

    const isEmpty = !cart || cart.items.length === 0 || isError;

    return (
        <Stack direction="column" gap={32}>
            {isEmpty ? (
                <CartPageItemsSection isCartReady={false} />
            ) : (
                <Grid className={styles.content} gap={32}>
                    <Stack direction="column" gap={32} className={styles.leftColumn}>
                        <CartPageItemsSection />
                    </Stack>

                    <CartSummaryCard cart={cart} error={isError} />
                </Grid>
            )}

            <BestSellingProducts />
        </Stack>
    );
};

export default CartPage;
