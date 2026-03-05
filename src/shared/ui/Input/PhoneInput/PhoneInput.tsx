import "react-international-phone/style.css";

import {useState} from "react";
import {PhoneInput as ReactPhoneInput} from "react-international-phone";

import {cn} from "@/shared/lib";

import type {InputProps} from "../Input";
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
        errorText,
        ...rest
    } = props;
    const hasError = error || Boolean(errorText);
    const [focus, setFocus] = useState<boolean>(false);

    const notifyFocus = () => {
        setFocus(true);
    };

    const notifyBlur = () => {
        setFocus(false);
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
                defaultCountry="us"
                forceDialCode
                disableCountryGuess
                value={value}
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
                })}
            />
            {errorText && <div className={styles.errorText}>{errorText}</div>}
        </div>
    );
};
