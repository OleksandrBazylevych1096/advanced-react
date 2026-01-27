import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';

import type {FacetItemType} from '@/entities/product/model/types/Product';

import {Accordion} from '@/shared/ui/Accordion/Accordion';

import {CheckboxFilterSection, type FilterSectionProps} from './CheckboxFilterSection';

const meta: Meta<typeof CheckboxFilterSection> = {
    title: 'features/productFilters/CheckboxFilterSection',
    component: CheckboxFilterSection,
    parameters: {
        layout: 'padded',
    },
    decorators: [
        (Story) => (
            <Accordion defaultValue={['category']}>
                <Story/>
            </Accordion>
        ),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CheckboxFilterSection>;

const mockCategories: FacetItemType[] = [
    {value: '1', label: 'Category 1', count: 245},
    {value: '2', label: 'Category 2', count: 189},
    {value: '3', label: 'Category 3', count: 156},
    {value: '4', label: 'Category 4', count: 98},
    {value: '5', label: 'Category 5', count: 67},
    {value: '6', label: 'Category 6', count: 45},
];


const CheckboxFilterWrapper = (args: FilterSectionProps) => {
    const [selectedValues, setSelectedValues] = useState<string[]>(
        args.selectedValues || []
    );

    const handleToggle = (value: string) => {
        setSelectedValues((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    return (
        <CheckboxFilterSection
            {...args}
            selectedValues={selectedValues}
            onToggle={handleToggle}
        />
    );
};

export const Default: Story = {
    render: (args) => <CheckboxFilterWrapper {...args} />,
    args: {
        title: 'Category',
        value: 'category',
        options: mockCategories,
        selectedValues: [],
    },
};

export const WithSelected: Story = {
    render: (args) => <CheckboxFilterWrapper {...args} />,
    args: {
        title: 'Category',
        value: 'category',
        options: mockCategories,
        selectedValues: ['1', '2', '5'],
    },
};

export const WithDisabledOptions: Story = {
    render: (args) => <CheckboxFilterWrapper {...args} />,
    args: {
        title: 'Category',
        value: 'category',
        options: mockCategories.map((cat) => cat.value === '1' ? {...cat, count: 0} : cat),
        selectedValues: [],
    },
};

export const Loading: Story = {
    render: (args) => <CheckboxFilterWrapper {...args} />,
    args: {
        title: 'Category',
        value: 'category',
        options: mockCategories,
        selectedValues: [],
        isLoading: true,
    },
};

export const Error: Story = {
    render: (args) => <CheckboxFilterWrapper {...args} />,
    args: {
        title: 'Category',
        value: 'category',
        options: mockCategories,
        selectedValues: [],
        error: true,
    },
};

export const NoOptions: Story = {
    render: (args) => <CheckboxFilterWrapper {...args} />,
    args: {
        title: 'Category',
        value: 'category',
        selectedValues: [],
    },
};


export const LargeList: Story = {
    render: (args) => <CheckboxFilterWrapper {...args} />,
    args: {
        title: 'Category',
        value: 'category',
        options: Array.from({length: 50}, (_, i) => ({
            value: `Category-${i}`,
            label: `Category ${i + 1}`,
            count: Math.floor(Math.random() * 100),
        })),
        selectedValues: [],
    },
};


export const AllDisabled: Story = {
    render: (args) => <CheckboxFilterWrapper {...args} />,
    args: {
        title: 'Category',
        value: 'category',
        options: mockCategories.map((cat) => ({...cat, count: 0})),
        selectedValues: [],
    },
};

export const SelectedDisabledOption: Story = {
    render: (args) => <CheckboxFilterWrapper {...args} />,
    args: {
        title: 'Category',
        value: 'category',
        options: mockCategories.map((cat) => cat.value === '1' ? {...cat, count: 0} : cat),
        selectedValues: ['1'],
    },
};