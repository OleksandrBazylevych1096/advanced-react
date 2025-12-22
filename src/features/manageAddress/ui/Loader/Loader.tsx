import { Spinner } from "@/shared/ui";

import styles from "./Loader.module.scss";

export const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <Spinner size="lg" />
    </div>
  );
};
