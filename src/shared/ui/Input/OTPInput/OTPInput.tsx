import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import { Input, type HTMLInputType } from "../Input";

import styles from "./OTPInput.module.scss";

interface OTPInputProps extends HTMLInputType {
  length?: number;
  onComplete?: (otp: string) => void;
  onChange?: (otp: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: boolean;
}

export const OTPInput = (props: OTPInputProps) => {
  const {
    onChange,
    onComplete,
    length = 4,
    disabled = false,
    autoFocus = true,
    error = false,
  } = props;

  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (value: string, index: number) => {
    if (disabled) return;

    const sanitizedValue = value.replace(/[^0-9]/g, "");

    if (sanitizedValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = sanitizedValue;
      setOtp(newOtp);

      const otpString = newOtp.join("");
      onChange?.(otpString);

      if (sanitizedValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== "") && newOtp.length === length) {
        onComplete?.(otpString);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (disabled) return;

    switch (e.key) {
      case "Backspace":
        if (!otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        } else {
          const newOpt = [...otp];
          newOpt[index] = "";
          setOtp(newOpt);
          onChange?.(newOpt.join(""));
        }
        break;

      case "ArrowLeft":
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
        break;

      case "ArrowRight":
        if (index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
        break;
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();

    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    if (pasteData) {
      const newOtp = [...otp];
      const pasteLength = Math.min(pasteData.length, length);

      for (let i = 0; i < pasteLength; i++) {
        newOtp[i] = pasteData[i];
      }

      setOtp(newOtp);

      const otpString = newOtp.join("");
      onChange?.(otpString);

      const nextIndex = Math.min(pasteLength, length - 1);
      inputRefs.current[nextIndex]?.focus();

      if (newOtp.every((digit) => digit !== "") && newOtp.length === length) {
        onComplete?.(otpString);
      }
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={styles.container}>
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          error={error}
          value={otp[index]}
          onChange={(value) => handleChange(value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          disabled={disabled}
          className={styles.otpInput}
        />
      ))}
    </div>
  );
};
