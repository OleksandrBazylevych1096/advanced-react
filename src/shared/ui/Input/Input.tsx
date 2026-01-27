import {
    type ChangeEvent,
    type FocusEvent,
    type InputHTMLAttributes,
    type KeyboardEvent,
    type ReactNode,
    type Ref,
    useEffect,
    useState
} from "react";

import type {CurrencyType, SupportedLngsType} from "@/shared/config";

import HideIcon from "../../assets/icons/Hide.svg?react";
import ShowIcon from "../../assets/icons/Show.svg?react";
import {cn, formatCurrency} from "../../lib";
import {Button} from "../Button/Button";
import {Spinner} from "../Spinner/Spinner";

import styles from "./Input.module.scss";

export type HTMLInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | 'onDragEnd'
>;

export type DecimalConfig = number | {
    places: number;
    mode?: 'round' | 'floor' | 'ceil';
};

export interface InputProps extends HTMLInputProps {
    className?: string;
    value?: string | number;
    disabled?: boolean;
    rounded?: boolean;
    label?: string;
    Icon?: ReactNode;
    error?: boolean;
    onChange?: (value: string) => void;
    ref?: Ref<HTMLInputElement>;
    isLoading?: boolean;
    type?: HTMLInputProps["type"] | "currency";
    currency?: CurrencyType;
    locale?: SupportedLngsType;
    decimal?: DecimalConfig;
    onDragEnd?: (value: string) => void
    
}

const applyRounding = (value: number, config: DecimalConfig): number => {
    const {places, mode} = typeof config === 'number'
        ? {places: config, mode: 'round' as const}
        : {places: config.places, mode: config.mode || 'round' as const};

    const multiplier = Math.pow(10, places);

    switch (mode) {
        case 'floor':
            return Math.floor(value * multiplier) / multiplier;
        case 'ceil':
            return Math.ceil(value * multiplier) / multiplier;
        case 'round':
        default:
            return Math.round(value * multiplier) / multiplier;
    }
};

export const Input = (props: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focus, setFocus] = useState(false);
    const [displayValue, setDisplayValue] = useState<string>("");

    const {
        className,
        value,
        onChange,
        onDragEnd,
        Icon,
        ref,
        label,
        error = false,
        disabled = false,
        rounded = false,
        type = "text",
        currency = "USD",
        isLoading,
        onFocus,
        onBlur,
        locale = 'en',
        decimal,
        ...rest
    } = props;

    useEffect(() => {
        if (type === "currency") {
            if (!focus && value !== undefined && value !== null && value !== "") {
                let numericValue = Number(value);

                if (decimal !== undefined) {
                    numericValue = applyRounding(numericValue, decimal);
                }

                setDisplayValue(formatCurrency(currency, locale, numericValue));
            } else if (!focus && (value === undefined || value === null || value === "")) {
                setDisplayValue("");
            }
        } else {
            setDisplayValue(String(value ?? ""));
        }
    }, [value, type, currency, locale, decimal, focus]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value;

        if (type === "currency") {
            const cleaned = raw.replace(/[^\d.]/g, "");
            const parts = cleaned.split(".");

            const formatted = parts.length > 2
                ? parts[0] + "." + parts.slice(1).join("")
                : cleaned;

            setDisplayValue(formatted);
            return;
        }

        onChange?.(raw);
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        setFocus(true);
        if (type === "currency" && displayValue) {
            let numeric = displayValue.replace(/[^\d.,]/g, "").replace(/,/g, ".");

            if (numeric.includes(".")) {
                numeric = numeric.replace(/\.?0+$/, "");
                if (numeric.endsWith(".")) {
                    numeric = numeric.slice(0, -1);
                }
            }

            setDisplayValue(numeric);
        }
        onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        setFocus(false);
        if (type === "currency" && displayValue) {
            const numeric = Number(displayValue.replace(/[^\d.]/g, ""));

            if (!isNaN(numeric)) {
                const finalValue = decimal !== undefined
                    ? applyRounding(numeric, decimal)
                    : numeric;

                setDisplayValue(formatCurrency(currency, locale, finalValue));
                onChange?.(String(finalValue));
            }
        }
        onBlur?.(e);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
        rest.onKeyDown?.(e);
    };

    const handleDragEnd = () => {
        if (onDragEnd) {
            onDragEnd(displayValue);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className={styles.wrapper}>
            {label && (
                <label className={cn(styles.label, {[styles.error]: error})}>
                    {label}
                </label>
            )}
            <div
                className={cn(styles.inputContainer, className, {
                    [styles.disabled]: disabled,
                    [styles.rounded]: rounded,
                    [styles.focus]: focus,
                    [styles.error]: error,
                })}
            >
                {Icon}
                <input
                    {...rest}
                    value={displayValue}
                    ref={ref}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onDragEnd={handleDragEnd}
                    type={showPassword && type === "password" ? "text" : type === "currency" ? "text" : type}
                    disabled={disabled}
                    onChange={handleChange}
                    className={cn(styles.input, {[styles.error]: error})}
                />

                {type === "password" && (
                    <Button
                        theme="ghost"
                        type="button"
                        className={styles.toggleVisibility}
                        onClick={toggleShowPassword}
                    >
                        {showPassword ? <HideIcon/> : <ShowIcon/>}
                    </Button>
                )}

                {isLoading && <Spinner size="sm" theme="primary"/>}
            </div>
        </div>
    );
};