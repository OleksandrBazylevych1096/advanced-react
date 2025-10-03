import { BestSellingProducts } from "@/widgets/BestSellingProducts";
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";

import styles from "./HomePage.module.scss";
import { PromoBanners } from "./PromoBanners/PromoBanners";

const HomePage = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.content}>
        <PromoBanners />
        <BestSellingProducts />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
