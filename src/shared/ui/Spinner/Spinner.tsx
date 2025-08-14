import { cn } from "@/shared/lib";

import styles from "./Spinner.module.scss";

type SpinnerSize = "lg" | "md" | "sm";
type SpinnerTheme = "primary" | "secondary";

interface SpinnerProps {
  size?: SpinnerSize;
  theme?: SpinnerTheme;
}

export const Spinner = (props: SpinnerProps) => {
  const { size = "md", theme = "primary" } = props;
  return (
    <div className={cn(styles.spinner, styles[theme], styles[size])}></div>
  );
};
