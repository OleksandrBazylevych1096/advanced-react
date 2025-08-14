import "react-international-phone/style.css";

import { useState } from "react";
import { PhoneInput as ReactPhoneInput } from "react-international-phone";

import { cn } from "@/shared/lib";

import type { InputProps } from "../Input";
import styles from "../Input.module.scss";

export const PhoneInput = (props: InputProps) => {
  const {
    className,
    value,
    onChange,
    label,
    rounded = false,
    disabled = false,
    error = false,
    ...rest
  } = props;
  const [focus, setFocus] = useState<boolean>(false);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const handleChange = (phone: string) => {
    onChange?.(phone);
  };

  return (
    <>
      {label && (
        <label className={cn(styles.label, { [styles.error]: error })}>
          {label}
        </label>
      )}

      <ReactPhoneInput
        inputProps={{ ...rest }}
        defaultCountry="us"
        forceDialCode
        disableCountryGuess
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        inputClassName={cn(styles.input, {
          [styles.disabled]: disabled,
          [styles.error]: error,
        })}
        className={cn(styles.inputContainer, className, {
          [styles.rounded]: rounded,
          [styles.disabled]: disabled,
          [styles.focus]: focus,
          [styles.error]: error,
        })}
      />
    </>
  );
};
