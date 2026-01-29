import {type ReactNode} from 'react';

import type {FacetItemType} from "@/entities/product/model/types/Product.ts";

import {Checkbox} from "@/shared/ui";
import {Accordion} from "@/shared/ui/Accordion/Accordion.tsx";

import styles from './CheckboxFilterSection.module.scss';


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
    'data-testid'?: string;
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
                                          'data-testid': dataTestId,
                                      }: FilterSectionProps) => {
    const selectedCount = selectedValues.length;

    if (error) {
        return (
            <Accordion.Item value={value}>
                <Accordion.Header>
                    {title}
                </Accordion.Header>
                <Accordion.Content className={styles.accordionContent}>
                    <div className={styles.error} data-testid={dataTestId ? `${dataTestId}-error` : undefined}>
                        <span>Error</span>
                    </div>
                </Accordion.Content>
            </Accordion.Item>
        );
    }

    if (isLoading) {
        return (
            <Accordion.Item value={value}>
                <Accordion.Header>
                    {title}
                </Accordion.Header>
                <Accordion.Content className={styles.accordionContent}>
                    <div className={styles.loading} data-testid={dataTestId ? `${dataTestId}-loading` : undefined}>
                        <div className={styles.skeleton}/>
                        <div className={styles.skeleton}/>
                        <div className={styles.skeleton}/>
                    </div>
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
            <Accordion.Content className={`${styles.accordionContent} ${className || ''}`}>
                {options.length === 0 ? (
                    <div className={styles.empty} data-testid={dataTestId ? `${dataTestId}-empty` : undefined}>{"No available data"}</div>
                ) : (
                    options.map((option) => {
                        const isChecked = selectedValues.includes(option.value);

                        if (renderOption) {
                            return (
                                <div key={option.value} onClick={() => onToggle(option.value)}>
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
                                data-testid={dataTestId ? `${dataTestId}-option-${option.value}` : undefined}
                            />
                        );
                    })
                )}
            </Accordion.Content>
        </Accordion.Item>
    );
};