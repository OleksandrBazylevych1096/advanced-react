import {BestSellingProducts} from "@/widgets/BestSellingProducts";
import {CategoryNavigation} from "@/widgets/CategoryNavigation";
import {Footer} from "@/widgets/Footer";
import {Header} from "@/widgets/Header";
import {PromoCarousel} from "@/widgets/PromoCarousel";
import {TrendingProducts} from "@/widgets/TrendingProducts";

import {AppPage} from "@/shared/ui";

import {FirstOrderSection} from "./FirstOrderSection/FirstOrderSection";
import styles from "./HomePage.module.scss";

const HomePage = () => {
    return (
        <AppPage>
            <Header/>
            <AppPage.Content>
                <div className={styles.promo}>
                    <PromoCarousel/>
                    <PromoCarousel
                        autoScrollOptions={{direction: "backward"}}
                    />
                </div>
                <CategoryNavigation/>
                <BestSellingProducts/>
                <FirstOrderSection/>
                <TrendingProducts/>
            </AppPage.Content>
            <Footer/>
        </AppPage>
    );
};

export default HomePage;
