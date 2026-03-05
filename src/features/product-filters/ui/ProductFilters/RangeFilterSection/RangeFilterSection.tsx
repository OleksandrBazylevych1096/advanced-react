import {type ReactNode} from "react";
import {useTranslation} from "react-i18next";

import type {CurrencyType, SupportedLngsType} from "@/shared/config";
import {clampRange} from "@/shared/lib";
import {Grid, Input, RangeSlider, Stack, Typography} from "@/shared/ui";
import {Accordion} from "@/shared/ui/Accordion/Accordion.tsx";
import type {RangeSliderValue} from "@/shared/ui/RangeSlider/RangeSlider.tsx";

import styles from "./RangeFilterSection.module.scss";

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
    inputType?: "number" | "currency";
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
    "data-testid"?: string;
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
    inputType = "number",
    currency,
    locale,
    step = 1,
    minRange = 5,
    decimalPlaces = 0,
    renderCustomInputs,
    "data-testid": dataTestId,
}: RangeFilterSectionProps) => {
    const {i18n} = useTranslation();
    const currentLocale = locale || i18n.language;

    const minLimit = availableRange?.min ?? 0;
    const maxLimit = availableRange?.max ?? 0;
    const effectiveMin = rangeValue.min ?? minLimit;
    const effectiveMax = rangeValue.max ?? maxLimit;

    const changeSliderRange = (sliderValue: RangeSliderValue) => {
        const [min, max] = sliderValue;
        const clamped = clampRange(min, max, minLimit, maxLimit);
        onChange(clamped);
    };

    const changeMinInput = (value: string) => {
        const num = Number(value);
        if (!num && num !== 0) return;

        const clamped = clampRange(num, effectiveMax, minLimit, maxLimit);
        onChange(clamped);
    };

    const changeMaxInput = (value: string) => {
        const num = Number(value);
        if (!num && num !== 0) return;

        const clamped = clampRange(effectiveMin, num, minLimit, maxLimit);
        onChange(clamped);
    };

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
                    </Stack>
                </Accordion.Content>
            </Accordion.Item>
        );
    }

    if (!availableRange || availableRange.min === undefined || availableRange.max === undefined) {
        return null;
    }

    return (
        <Accordion.Item value={value}>
            <Accordion.Header>{title}</Accordion.Header>
            <Accordion.Content className={className}>
                <Stack gap={16}>
                    {renderCustomInputs ? (
                        renderCustomInputs({
                            min: effectiveMin,
                            max: effectiveMax,
                            onMinChange: changeMinInput,
                            onMaxChange: changeMaxInput,
                        })
                    ) : (
                        <Grid cols={2} gap={12}>
                            <Input
                                type={inputType}
                                currency={currency}
                                locale={currentLocale}
                                value={effectiveMin}
                                onChange={changeMinInput}
                                decimal={{mode: "floor", places: decimalPlaces}}
                                label="Min"
                                data-testid={dataTestId ? `${dataTestId}-min-input` : undefined}
                            />
                            <Input
                                type={inputType}
                                currency={currency}
                                locale={currentLocale}
                                value={effectiveMax}
                                onChange={changeMaxInput}
                                decimal={{mode: "ceil", places: decimalPlaces}}
                                label="Max"
                                data-testid={dataTestId ? `${dataTestId}-max-input` : undefined}
                            />
                        </Grid>
                    )}

                    <RangeSlider
                        min={minLimit}
                        max={maxLimit}
                        step={step}
                        minRange={minRange}
                        value={[effectiveMin, effectiveMax]}
                        onChange={changeSliderRange}
                        tooltip="never"
                        data-testid={dataTestId ? `${dataTestId}-slider` : undefined}
                    />
                </Stack>
            </Accordion.Content>
        </Accordion.Item>
    );
};
