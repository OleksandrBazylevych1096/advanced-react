import {type ReactNode} from "react";

import type {FacetItemType} from "@/entities/product";

import {Accordion} from "@/shared/ui/Accordion";
import {Checkbox} from "@/shared/ui/Checkbox";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./CheckboxFilterSection.module.scss";

export interface FilterSectionProps {
    title: string;
    value: string;
    options?: FacetItemType[];
    selectedValues: string[];
    onToggle: (value: string) => void;
    isLoading?: boolean;
    error?: boolean;
    className?: string;
    renderOption?: (option: FacetItemType, isChecked: boolean) => ReactNode;
    "data-testid"?: string;
}

export const CheckboxFilterSection = ({
    title,
    value,
    options,
    selectedValues,
    onToggle,
    isLoading = false,
    error = false,
    className,
    renderOption,
    "data-testid": dataTestId,
}: FilterSectionProps) => {
    const selectedCount = selectedValues.length;

    if (error) {
        return (
            <Accordion.Item value={value}>
                <Accordion.Header>{title}</Accordion.Header>
                <Accordion.Content>
                    <Typography
                        variant="bodySm"
                        tone="danger"
                        weight="semibold"
                        data-testid={dataTestId ? `${dataTestId}-error` : undefined}
                    >
                        Error
                    </Typography>
                </Accordion.Content>
            </Accordion.Item>
        );
    }

    if (isLoading) {
        return (
            <Accordion.Item value={value}>
                <Accordion.Header>{title}</Accordion.Header>
                <Accordion.Content>
                    <Stack gap={12} data-testid={dataTestId ? `${dataTestId}-loading` : undefined}>
                        <div className={styles.skeleton} />
                        <div className={styles.skeleton} />
                        <div className={styles.skeleton} />
                    </Stack>
                </Accordion.Content>
            </Accordion.Item>
        );
    }

    if (!options || options.length === 0) {
        return null;
    }

    return (
        <Accordion.Item value={value}>
            <Accordion.Header>
                {title} {selectedCount > 0 && `(${selectedCount})`}
            </Accordion.Header>
            <Accordion.Content className={className}>
                {options.length === 0 ? (
                    <Typography
                        className={styles.empty}
                        variant="bodySm"
                        tone="muted"
                        data-testid={dataTestId ? `${dataTestId}-empty` : undefined}
                    >
                        {"No available data"}
                    </Typography>
                ) : (
                    <Stack gap={16}>
                        {options.map((option) => {
                            const isChecked = selectedValues.includes(option.value);

                            if (renderOption) {
                                return (
                                    <div
                                        key={option.value}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => onToggle(option.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                onToggle(option.value);
                                            }
                                        }}
                                    >
                                        {renderOption(option, isChecked)}
                                    </div>
                                );
                            }

                            return (
                                <Checkbox
                                    disabled={option.count === 0}
                                    className={styles.checkbox}
                                    label={`${option.label || option.value} (${option.count})`}
                                    key={option.value}
                                    checked={isChecked}
                                    onChange={() => onToggle(option.value)}
                                    data-testid={
                                        dataTestId
                                            ? `${dataTestId}-option-${option.value}`
                                            : undefined
                                    }
                                />
                            );
                        })}
                    </Stack>
                )}
            </Accordion.Content>
        </Accordion.Item>
    );
};
