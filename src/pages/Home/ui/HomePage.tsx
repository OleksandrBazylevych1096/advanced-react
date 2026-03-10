import {BestSellingProducts} from "@/widgets/BestSellingProducts";
import {CategoryNavigation} from "@/widgets/CategoryNavigation";
import {PromoCarousel} from "@/widgets/PromoCarousel";
import {TrendingProducts} from "@/widgets/TrendingProducts";

import {Stack} from "@/shared/ui";

import {FirstOrderSection} from "./FirstOrderSection/FirstOrderSection";

const HomePage = () => {
    return (
        <>
            <Stack gap={20}>
                <PromoCarousel />
                <PromoCarousel autoScrollOptions={{direction: "backward"}} />
            </Stack>
            <CategoryNavigation />
            <BestSellingProducts />
            <FirstOrderSection />
            <TrendingProducts />
        </>
    );
};

export default HomePage;
