import type { FunctionComponent, SVGProps } from "react";

import { cn } from "@/shared/lib";

import styles from "./AppIcon.module.scss";

type AppIconTheme = "clean" | "background";

interface AppIconProps {
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  theme?: AppIconTheme;
  size?: number;
  className?: string;
  filled?: boolean;
}

export const AppIcon = (props: AppIconProps) => {
  const { Icon, className, theme = "clean", size = 24, filled = false } = props;

  const AppIcon = (
    <Icon
      width={size}
      height={size}
      className={cn(styles.icon, className, {
        [styles.filled]: filled,
      })}
    />
  );

  if (theme === "background") {
    return <div className={styles.wrapper}>{AppIcon}</div>;
  }
  return AppIcon;
};
