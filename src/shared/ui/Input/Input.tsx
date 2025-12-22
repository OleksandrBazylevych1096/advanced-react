import {type ChangeEvent, type FocusEvent, type InputHTMLAttributes, type ReactNode, type Ref, useState,} from "react";

import HideIcon from "../../assets/icons/Hide.svg?react";
import ShowIcon from "../../assets/icons/Show.svg?react";
import {cn} from "../../lib";
import {Button} from "../Button/Button";
import {Spinner} from "../Spinner/Spinner";

import styles from "./Input.module.scss";

export type HTMLInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
>;

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
}

export const Input = (props: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focus, setFocus] = useState(false);

    const {
        className,
        value,
        onChange,
        Icon,
        ref,
        label,
        error = false,
        disabled = false,
        rounded = false,
        type = "text",
        isLoading,
        onFocus,
        onBlur,
        ...rest
    } = props;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        setFocus(true);
        onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        setFocus(false);
        onBlur?.(e);
    };

    return (
        <>
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
                    value={value}
                    ref={ref}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    type={showPassword && type === "password" ? "text" : type}
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
        </>
    );
};
