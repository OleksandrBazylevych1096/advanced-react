import {BestSellingProducts} from "@/widgets/BestSellingProducts";
import {CategoryNavigation} from "@/widgets/CategoryNavigation";
import {Footer} from "@/widgets/Footer";
import {Header} from "@/widgets/Header";
import {PromoCarousel} from "@/widgets/PromoCarousel";
import {TrendingProducts} from "@/widgets/TrendingProducts";

import {AppPage, Stack} from "@/shared/ui";

import {FirstOrderSection} from "./FirstOrderSection/FirstOrderSection";

const HomePage = () => {
    return (
        <AppPage>
            <Header />
            <AppPage.Content>
                <Stack gap={20}>
                    <PromoCarousel />
                    <PromoCarousel autoScrollOptions={{direction: "backward"}} />
                </Stack>
                <CategoryNavigation />
                <BestSellingProducts />
                <FirstOrderSection />
                <TrendingProducts />
            </AppPage.Content>
            <Footer />
        </AppPage>
    );
};

export default HomePage;
