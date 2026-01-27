import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';

import {Accordion} from '@/shared/ui/Accordion/Accordion';

import {RangeFilterSection, type RangeFilterSectionProps, type RangeValue} from './RangeFilterSection';

const meta: Meta<typeof RangeFilterSection> = {
    title: 'features/productFilters/RangeFilterSection',
    component: RangeFilterSection,
    parameters: {
        layout: 'padded',
    },
    decorators: [
        (Story) => (
            <Accordion defaultValue={['price']}>
                <Story/>
            </Accordion>
        ),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RangeFilterSection>;

const RangeFilterWrapper = (args: RangeFilterSectionProps) => {
    const [rangeValue, setRangeValue] = useState<RangeValue>(
        args.rangeValue || {min: args.availableRange?.min, max: args.availableRange?.max}
    );

    return (
        <RangeFilterSection
            {...args}
            rangeValue={rangeValue}
            onChange={setRangeValue}
        />
    );
};

export const Default: Story = {
    render: (args) => <RangeFilterWrapper {...args} />,
    args: {
        title: 'Price Range',
        value: 'price',
        rangeValue: {min: 100, max: 500},
        availableRange: {min: 0, max: 1000},
        inputType: 'number',
        currency: 'USD',
        locale: 'en',
        step: 10,
        minRange: 50,
    },
};

export const Loading: Story = {
    render: (args) => <RangeFilterWrapper {...args} />,
    args: {
        title: 'Price Range',
        value: 'price',
        rangeValue: {min: 100, max: 500},
        availableRange: {min: 0, max: 1000},
        inputType: 'number',
        currency: 'USD',
        locale: 'en',
        isLoading: true,
    },
};

export const Error: Story = {
    render: (args) => <RangeFilterWrapper {...args} />,
    args: {
        title: 'Price Range',
        value: 'price',
        rangeValue: {min: 100, max: 500},
        availableRange: {min: 0, max: 1000},
        inputType: 'number',
        currency: 'USD',
        locale: 'en',
        error: true,
    },
};

export const NoAvailableRange: Story = {
    render: (args) => <RangeFilterWrapper {...args} />,
    args: {
        title: 'Price Range',
        value: 'price',
        rangeValue: {min: 100, max: 500},
        inputType: 'number',
        currency: 'USD',
        locale: 'en',
    },
};


export const SmallRange: Story = {
    render: (args) => <RangeFilterWrapper {...args} />,
    args: {
        title: 'Price Range',
        value: 'price',
        rangeValue: {min: 3, max: 4.5},
        availableRange: {min: 0, max: 5},
        inputType: 'number',
        currency: 'USD',
        locale: 'en',
        step: 0.5,
        minRange: 0.5,
        decimalPlaces: 1,
    },
};

export const LargeRange: Story = {
    render: (args) => <RangeFilterWrapper {...args} />,
    args: {
        title: 'Price Range',
        value: 'price',
        rangeValue: {min: 100000, max: 5000000},
        availableRange: {min: 0, max: 10000000},
        inputType: 'currency',
        currency: 'USD',
        locale: 'en',
        step: 50000,
        minRange: 100000,
    },
};