import "react-international-phone/style.css";

import {type FocusEvent, useState} from "react";
import {
    PhoneInput as ReactPhoneInput,
    type PhoneInputProps as ReactPhoneInputProps,
} from "react-international-phone";

import {cn} from "@/shared/lib/styling";

import type {HTMLInputProps} from "../Input";
import styles from "../Input.module.scss";

interface PhoneInputProps extends HTMLInputProps {
    className?: string;
    value?: string;
    disabled?: boolean;
    rounded?: boolean;
    label?: string;
    error?: boolean;
    errorText?: string;
    fullWidth?: boolean;
    onChange?: (value: string) => void;
    defaultCountry?: ReactPhoneInputProps["defaultCountry"];
    forceDialCode?: ReactPhoneInputProps["forceDialCode"];
    disableCountryGuess?: ReactPhoneInputProps["disableCountryGuess"];
}

export const PhoneInput = (props: PhoneInputProps) => {
    const {
        className,
        value,
        onChange,
        label,
        rounded = false,
        disabled = false,
        error = false,
        errorText,
        fullWidth = false,
        defaultCountry = "us",
        forceDialCode = true,
        disableCountryGuess = true,
        onFocus,
        onBlur,
        ...rest
    } = props;
    const hasError = error || Boolean(errorText);
    const [focus, setFocus] = useState<boolean>(false);

    const notifyFocus = (event: FocusEvent<HTMLInputElement>) => {
        setFocus(true);
        onFocus?.(event);
    };

    const notifyBlur = (event: FocusEvent<HTMLInputElement>) => {
        setFocus(false);
        onBlur?.(event);
    };

    const changePhone = (phone: string) => {
        onChange?.(phone);
    };

    return (
        <div className={styles.wrapper}>
            {label && (
                <label className={cn(styles.label, {[styles.error]: hasError})}>{label}</label>
            )}

            <ReactPhoneInput
                inputProps={{...rest}}
                defaultCountry={defaultCountry}
                forceDialCode={forceDialCode}
                disableCountryGuess={disableCountryGuess}
                value={value ?? ""}
                disabled={disabled}
                onChange={changePhone}
                onFocus={notifyFocus}
                onBlur={notifyBlur}
                inputClassName={cn(styles.input, {
                    [styles.disabled]: disabled,
                    [styles.error]: hasError,
                })}
                className={cn(styles.inputContainer, className, {
                    [styles.rounded]: rounded,
                    [styles.disabled]: disabled,
                    [styles.focus]: focus,
                    [styles.error]: hasError,
                    [styles.fullWidth]: fullWidth,
                })}
            />
            {errorText && <div className={styles.errorText}>{errorText}</div>}
        </div>
    );
};
