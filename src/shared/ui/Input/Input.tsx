import {
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

import HideIcon from "@/shared/assets/icons/Hide.svg?react";
import ShowIcon from "@/shared/assets/icons/Show.svg?react";
import { cn } from "@/shared/lib";

import { Button } from "../Button/Button";

import styles from "./Input.module.scss";

export type HTMLInputType = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
>;

export interface InputProps extends HTMLInputType {
  className?: string;
  value?: string;
  disabled?: boolean;
  rounded?: boolean;
  Icon?: ReactNode;
  onChange?: (value: string) => void;
  error?: boolean;
  label?: string;
  ref?: Ref<HTMLInputElement>;
}

export const Input = (props: InputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);

  const {
    className,
    value,
    Icon,
    onChange,
    label,
    ref,
    rounded = false,
    disabled = false,
    type = "text",
    error = false,
    ...rest
  } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  return (
    <>
      {label && (
        <label className={cn(styles.label, { [styles.error]: error })}>
          {label}
        </label>
      )}
      <div
        className={cn(styles.inputContainer, className, {
          [styles.rounded]: rounded,
          [styles.disabled]: disabled,
          [styles.focus]: focus,
          [styles.error]: error,
        })}
      >
        {Icon}
        <input
          {...rest}
          ref={ref}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type={showPassword && type === "password" ? "text" : type}
          className={cn(styles.input, {
            [styles.disabled]: disabled,
            [styles.error]: error,
          })}
        />

        {type === "password" && (
          <Button
            theme="ghost"
            type="button"
            className={styles.toggleVisibility}
            onClick={toggleShowPassword}
          >
            {showPassword ? <HideIcon /> : <ShowIcon />}
          </Button>
        )}
      </div>
    </>
  );
};
