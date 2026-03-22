import {applyCouponReducer} from "@/features/checkout/apply-coupon";
import {chooseDeliveryTipReducer} from "@/features/checkout/choose-delivery-tip";

import {DynamicModuleLoader} from "@/shared/lib/state";
import {Stack} from "@/shared/ui/Stack";

import {CheckoutMainSection} from "./CheckoutMainSection/CheckoutMainSection";
import styles from "./CheckoutPage.module.scss";
import {CheckoutSidebar} from "./CheckoutSidebar/CheckoutSidebar";

const reducers = {
    chooseDeliveryTip: chooseDeliveryTipReducer,
    applyCoupon: applyCouponReducer,
};

const CheckoutPage = () => {
    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <Stack as="section" className={styles.layout} gap={24}>
                <CheckoutMainSection />
                <CheckoutSidebar />
            </Stack>
        </DynamicModuleLoader>
    );
};

export default CheckoutPage;
