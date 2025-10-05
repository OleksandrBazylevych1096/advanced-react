import { BestSellingProducts } from "@/widgets/BestSellingProducts";
import { CategoryNavigation } from "@/widgets/CategoryNavigation";
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import { TrendingProducts } from "@/widgets/TrendingProducts";

import { FirstOrderSection } from "./FirstOrderSection/FirstOrderSection";
import styles from "./HomePage.module.scss";
import { PromoBanners } from "./PromoBanners/PromoBanners";

const HomePage = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.content}>
        <PromoBanners />
        <CategoryNavigation />
        <BestSellingProducts />
        <FirstOrderSection />
        <TrendingProducts />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
