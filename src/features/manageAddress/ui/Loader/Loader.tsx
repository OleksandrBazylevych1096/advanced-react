import { Spinner } from "@/shared/ui";

import styles from "./Loader.module.scss";

export const Loader = () => {
  return (
    <div className={styles.wrapper} data-testid="address-loader">
      <Spinner size="lg" />
    </div>
  );
};
