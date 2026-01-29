import {useEffect, useId, useState} from "react";

import CheckedIcon from '@/shared/assets/icons/Checked.svg?react'
import {cn} from "@/shared/lib";

import styles from './Checkbox.module.scss'

interface CheckboxProps {
    label?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    id?: string;
    className?: string
    readOnly?: boolean
    "data-testid"?: string
}

export const Checkbox = (props: CheckboxProps) => {
    const {
        label,
        className,
        checked = false,
        onChange,
        disabled = false,
        readOnly = false,
        id: externalId,
        'data-testid': dataTestId = 'checkbox'
    } = props

    const id = useId()
    const [isChecked, setIsChecked] = useState(checked);

    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const handleChange = () => {
        if (disabled || readOnly) return;

        const newValue = !isChecked;
        setIsChecked(newValue);
        onChange?.(newValue);
    };

    const checkboxId = externalId || id

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.container}>
                <input
                    data-testid={dataTestId}
                    type="checkbox"
                    id={checkboxId}
                    checked={isChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    readOnly={readOnly}
                    className={styles.input}
                />

                <div
                    onClick={handleChange}
                    className={cn(
                        styles.box,
                        {
                            [styles.checked]: isChecked,
                            [styles.disabled]: disabled,
                            [styles.readOnly]: readOnly
                        }
                    )}
                >
                    <CheckedIcon
                        className={cn(styles.icon, {[styles.visible]: isChecked})}
                    />
                </div>
            </div>

            {label && (
                <label
                    htmlFor={checkboxId}
                    className={cn(
                        styles.label,
                        {
                            [styles.disabled]: disabled,
                            [styles.readOnly]: readOnly
                        }
                    )}
                >
                    {label}
                </label>
            )}
        </div>
    );
};
