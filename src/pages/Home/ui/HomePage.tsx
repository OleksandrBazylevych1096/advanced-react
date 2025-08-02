import styles from "./HomePage.module.scss";
import { Header } from "@/widgets/Header";
import { Footer } from "@/widgets/Footer";

const HomePage = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.content}>hello</main>
      <Footer />
    </div>
  );
};

export default HomePage;
