import {applyCouponReducer} from "@/features/apply-coupon";
import {chooseDeliveryTipReducer} from "@/features/choose-delivery-tip";

import {DynamicModuleLoader} from "@/shared/lib";
import {Stack} from "@/shared/ui";

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
