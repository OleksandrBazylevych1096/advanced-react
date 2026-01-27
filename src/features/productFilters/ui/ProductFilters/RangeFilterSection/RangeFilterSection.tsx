import {type ReactNode} from 'react';
import {useTranslation} from "react-i18next";

import type {CurrencyType, SupportedLngsType} from "@/shared/config";
import {clampRange, cn} from "@/shared/lib";
import {Input, RangeSlider} from "@/shared/ui";
import {Accordion} from "@/shared/ui/Accordion/Accordion.tsx";
import type {RangeSliderValue} from "@/shared/ui/RangeSlider/RangeSlider.tsx";

import styles from './RangeFilterSection.module.scss';

export interface RangeValue {
    min?: number;
    max?: number;
}

export interface RangeFilterSectionProps {
    title: string;
    value: string;
    rangeValue: RangeValue;
    availableRange?: RangeValue;
    onChange: (value: RangeValue) => void;
    isLoading?: boolean;
    error?: boolean;
    className?: string;
    inputType?: 'number' | 'currency';
    currency: CurrencyType;
    locale: SupportedLngsType;
    step?: number;
    minRange?: number;
    decimalPlaces?: number;
    formatLabel?: (value: number) => string;
    renderCustomInputs?: (props: {
        min: number;
        max: number;
        onMinChange: (value: string) => void;
        onMaxChange: (value: string) => void;
    }) => ReactNode;
}

export const RangeFilterSection = ({
                                       title,
                                       value,
                                       rangeValue,
                                       availableRange,
                                       onChange,
                                       isLoading = false,
                                       error = false,
                                       className,
                                       inputType = 'number',
                                       currency,
                                       locale,
                                       step = 1,
                                       minRange = 5,
                                       decimalPlaces = 0,
                                       renderCustomInputs,
                                   }: RangeFilterSectionProps) => {
    const {i18n} = useTranslation();
    const currentLocale = locale || i18n.language;

    const minLimit = availableRange?.min ?? 0;
    const maxLimit = availableRange?.max ?? 0;
    const effectiveMin = rangeValue.min ?? minLimit;
    const effectiveMax = rangeValue.max ?? maxLimit;

    const handleSliderChange = (sliderValue: RangeSliderValue) => {
        const [min, max] = sliderValue;
        const clamped = clampRange(min, max, minLimit, maxLimit);
        onChange(clamped);
    };

    const handleMinInput = (value: string) => {
        const num = Number(value);
        if (!num && num !== 0) return;

        const clamped = clampRange(num, effectiveMax, minLimit, maxLimit);
        onChange(clamped);
    };

    const handleMaxInput = (value: string) => {
        const num = Number(value);
        if (!num && num !== 0) return;

        const clamped = clampRange(effectiveMin, num, minLimit, maxLimit);
        onChange(clamped);
    };

    if (error) {
        return (
            <Accordion.Item value={value}>
                <Accordion.Header>
                    {title}
                </Accordion.Header>
                <Accordion.Content className={styles.accordionContent}>
                    <div className={styles.error}>
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
                    <div className={styles.loading}>
                        <div className={styles.skeleton}/>
                    </div>
                </Accordion.Content>
            </Accordion.Item>
        );
    }

    if (
        !availableRange ||
        availableRange.min === undefined ||
        availableRange.max === undefined
    ) {
        return null;
    }


    return (
        <Accordion.Item value={value}>
            <Accordion.Header>
                {title}
            </Accordion.Header>
            <Accordion.Content className={cn(styles.accordionContent, className)}>
                <div className={styles.container}>
                    {renderCustomInputs ? (
                        renderCustomInputs({
                            min: effectiveMin,
                            max: effectiveMax,
                            onMinChange: handleMinInput,
                            onMaxChange: handleMaxInput,
                        })
                    ) : (
                        <div className={styles.inputGroup}>
                            <Input
                                type={inputType}
                                currency={currency}
                                locale={currentLocale}
                                value={effectiveMin}
                                onChange={handleMinInput}
                                decimal={{mode: 'floor', places: decimalPlaces}}
                                label="Min"
                            />
                            <Input
                                type={inputType}
                                currency={currency}
                                locale={currentLocale}
                                value={effectiveMax}
                                onChange={handleMaxInput}
                                decimal={{mode: 'ceil', places: decimalPlaces}}
                                label="Max"
                            />
                        </div>
                    )}

                    <RangeSlider
                        min={minLimit}
                        max={maxLimit}
                        step={step}
                        minRange={minRange}
                        value={[effectiveMin, effectiveMax]}
                        onChange={handleSliderChange}
                        tooltip="never"
                    />
                </div>
            </Accordion.Content>
        </Accordion.Item>
    );
};
