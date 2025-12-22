import {useEffect, useState} from 'react';

import {
    selectFacets,
    selectSelectedBrands,
    selectSelectedCountries,
    selectSelectedPriceRange
} from "@/features/productFilters/model/selectors/productFiltersSelectors.ts";
import {productFiltersActions} from "@/features/productFilters/model/slice/productFiltersSlice.ts";
import {PriceRange} from "@/features/productFilters/ui/ProductFilters/PriceRange.tsx";

import type {PriceRangeType} from "@/entities/product/model/types/Product";

import {useAppDispatch, useAppSelector} from "@/shared/lib";
import {Button, Checkbox} from "@/shared/ui";
import {Accordion} from "@/shared/ui/Accordion/Accordion.tsx";

import styles from './ProductFilters.module.scss'

export const ProductFilters = () => {
    const dispatch = useAppDispatch();
    const facets = useAppSelector(selectFacets);
    const appliedCountries = useAppSelector(selectSelectedCountries);
    const appliedBrands = useAppSelector(selectSelectedBrands);
    const appliedPriceRange = useAppSelector(selectSelectedPriceRange);

    const [tempCountries, setTempCountries] = useState<string[]>([]);
    const [tempBrands, setTempBrands] = useState<string[]>([]);
    const [tempPriceRange, setTempPriceRange] = useState<PriceRangeType>({min: undefined, max: undefined});

    useEffect(() => {
        setTempCountries(appliedCountries);
        setTempBrands(appliedBrands);
        setTempPriceRange(appliedPriceRange || {min: undefined, max: undefined});
    }, [appliedCountries, appliedBrands, appliedPriceRange]);

    const handleCountryChange = (countryValue: string) => {
        setTempCountries(prev => {
            const index = prev.indexOf(countryValue);
            if (index > -1) {
                return prev.filter(c => c !== countryValue);
            } else {
                return [...prev, countryValue];
            }
        });
    };

    const handleBrandChange = (brandValue: string) => {
        setTempBrands(prev => {
            const index = prev.indexOf(brandValue);
            if (index > -1) {
                return prev.filter(b => b !== brandValue);
            } else {
                return [...prev, brandValue];
            }
        });
    };

    const handlePriceRangeChange = (priceRange: PriceRangeType) => {
        setTempPriceRange(priceRange);
    };

    const handleApply = () => {
        dispatch(productFiltersActions.setSelectedCountries(tempCountries));
        dispatch(productFiltersActions.setSelectedBrands(tempBrands));
        dispatch(productFiltersActions.setSelectedPriceRange(tempPriceRange));
    };

    const handleReset = () => {

        setTempCountries([]);
        setTempBrands([]);
        setTempPriceRange({
            min: facets?.priceRange.min,
            max: facets?.priceRange.max
        });
    };

    const hasChanges =
        JSON.stringify([...tempCountries].sort()) !== JSON.stringify([...appliedCountries].sort()) ||
        JSON.stringify([...tempBrands].sort()) !== JSON.stringify([...appliedBrands].sort()) ||
        tempPriceRange.min !== appliedPriceRange?.min ||
        tempPriceRange.max !== appliedPriceRange?.max;

    if (!facets) return null;

    return (
        <div>
            <Accordion>
                {facets.countries && facets.countries.length > 0 &&
                    <Accordion.Item value="countries">
                        <Accordion.Header>
                            Countries {tempCountries.length > 0 && `(${tempCountries.length})`}
                        </Accordion.Header>
                        <Accordion.Content className={styles.accordionContent}>
                            {facets.countries.map(({value, count}) => {
                                const isChecked = tempCountries.includes(value);
                                return (
                                    <Checkbox
                                        className={styles.checkbox}
                                        label={`${value} (${count})`}
                                        key={value}
                                        checked={isChecked}
                                        onChange={() => handleCountryChange(value)}
                                    />
                                );
                            })}
                        </Accordion.Content>
                    </Accordion.Item>
                }

                {facets.brands && facets.brands.length > 0 &&
                    <Accordion.Item value="brands">
                        <Accordion.Header>
                            Brands {tempBrands.length > 0 && `(${tempBrands.length})`}
                        </Accordion.Header>
                        <Accordion.Content className={styles.accordionContent}>
                            {facets.brands.map(({value, count}) => {
                                const isChecked = tempBrands.includes(value);

                                return (
                                    <Checkbox
                                        className={styles.checkbox}
                                        label={`${value} (${count})`}
                                        key={value}
                                        checked={isChecked}
                                        onChange={() => handleBrandChange(value)}
                                    />
                                );
                            })}
                        </Accordion.Content>
                    </Accordion.Item>
                }

                <Accordion.Item value={'price'}>
                    <Accordion.Header>
                        Price
                    </Accordion.Header>
                    <Accordion.Content className={styles.accordionContent}>
                        <PriceRange
                            value={tempPriceRange}
                            onChange={handlePriceRangeChange}
                        />
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>

            <div className={styles.actions}>
                <Button
                    fullWidth={true}
                    onClick={handleApply}
                    disabled={!hasChanges}
                >
                    Apply
                </Button>
                {hasChanges && (
                    <Button
                        fullWidth={true}
                        theme="outline"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
};