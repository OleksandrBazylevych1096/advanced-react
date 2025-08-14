import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib";

import { Spinner } from "../Spinner/Spinner";

import styles from "./Button.module.scss";

type ButtonSize = "xs" | "sm" | "md" | "lg";
type ButtonForm = "rounded" | "pill" | "circle";
type ButtonTheme = "primary" | "secondary" | "tertiary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  size?: ButtonSize;
  form?: ButtonForm;
  theme?: ButtonTheme;
  disabled?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = (props: ButtonProps) => {
  const {
    children,
    className,
    size = "sm",
    theme = "primary",
    form = "pill",
    disabled = false,
    fullWidth = false,
    isLoading = false,
    ...rest
  } = props;
  return (
    <button
      {...rest}
      disabled={disabled}
      className={cn(
        styles.button,
        className,
        styles[size],
        styles[form],
        styles[theme],
        {
          [styles.disabled]: disabled,
          [styles.fullWidth]: fullWidth,
          [styles.isLoading]: isLoading,
        }
      )}
    >
      {isLoading && <Spinner size="sm" theme="secondary" />}
      {children}
    </button>
  );
};
