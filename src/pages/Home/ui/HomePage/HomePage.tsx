import {BestSellingProducts} from "@/widgets/BestSellingProducts";
import {CategoryNavigation} from "@/widgets/CategoryNavigation";
import {PromoCarousel} from "@/widgets/PromoCarousel";

import {Stack} from "@/shared/ui/Stack";

import {FirstOrderSection} from "../FirstOrderSection/FirstOrderSection";
import {TrendingProducts} from "../TrendingProducts/TrendingProducts";

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
