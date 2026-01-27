import type {Meta, StoryObj} from '@storybook/react-vite';

import {Select, type SelectOption} from './Select';

const meta: Meta<typeof Select> = {
    title: 'shared/Select',
    component: Select,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div style={{height: '250px', width: '100%'}}>
                <Story/>
            </div>
        ),
    ],
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

const basicOptions: SelectOption[] = [
    {label: 'Option 1', value: '1'},
    {label: 'Option 2', value: '2'},
    {label: 'Option 3', value: '3'},
    {label: 'Option 4', value: '4'},
    {label: 'Option 5', value: '5'},
];

export const Default: Story = {
    args: {
        options: basicOptions,
        placeholder: 'Select an option',
    },
};

export const Opened: Story = {
    args: {
        isOpen: true,
        options: basicOptions,
        placeholder: 'Select an option',
    },
};


export const WithDefaultValue: Story = {
    args: {
        options: basicOptions,
        defaultValue: '2',
        placeholder: 'Select an option',
    },
};

export const Multiple: Story = {
    args: {
        options: basicOptions,
        multiple: true,
        placeholder: 'Select multiple options',
    },
};

export const MultipleWithDefaultValue: Story = {
    args: {
        options: basicOptions,
        multiple: true,
        defaultValue: ['2', '4'],
        placeholder: 'Select multiple options',
    },
};

export const Searchable: Story = {
    args: {
        options: basicOptions,
        searchable: true,
        placeholder: 'Search countries...',
    },
};

export const SearchableMultiple: Story = {
    args: {
        options: basicOptions,
        searchable: true,
        multiple: true,
        placeholder: 'Search and select...',
    },
};

export const Clearable: Story = {
    args: {
        options: basicOptions,
        clearable: true,
        defaultValue: '3',
        placeholder: 'Select an option',
    },
};

export const Disabled: Story = {
    args: {
        options: basicOptions,
        disabled: true,
        defaultValue: '2',
        placeholder: 'Disabled select',
    },
};

export const ReadOnly: Story = {
    args: {
        options: basicOptions,
        readonly: true,
        defaultValue: '3',
        placeholder: 'Read-only select',
    },
};

export const Loading: Story = {
    args: {
        options: basicOptions,
        loading: true,
        placeholder: 'Loading...',
    },
};

export const WithError: Story = {
    args: {
        options: basicOptions,
        error: true,
        errorMessage: 'error text',
        placeholder: 'Select an option',
    },
};

export const WithHelperText: Story = {
    args: {
        options: basicOptions,
        helperText: 'helper text',
        placeholder: 'Select an option',
    },
};

export const DisabledOptions: Story = {
    args: {
        options: [
            {label: 'Option 1', value: '1'},
            {label: 'Option 2 (disabled)', value: '2', disabled: true},
            {label: 'Option 3', value: '3'},
            {label: 'Option 4 (disabled)', value: '4', disabled: true},
            {label: 'Option 5', value: '5'},
        ],
        placeholder: 'Some options are disabled',
    },
};

export const WithOptionGroups: Story = {
    args: {
        optionGroups: [
            {
                label: 'Fruits',
                options: [
                    {label: 'Apple', value: 'apple'},
                    {label: 'Banana', value: 'banana'},
                    {label: 'Orange', value: 'orange'},
                ],
            },
            {
                label: 'Vegetables',
                options: [
                    {label: 'Carrot', value: 'carrot'},
                    {label: 'Broccoli', value: 'broccoli'},
                    {label: 'Tomato', value: 'tomato'},
                ],
            },
        ],
        placeholder: 'Select food',
    },
};

export const Xs: Story = {
    args: {
        options: basicOptions,
        size: 'xs',
        placeholder: 'Select an option',
    },
};

export const Sm: Story = {
    args: {
        options: basicOptions,
        size: 'sm',
        placeholder: 'Select an option',
    },
};

export const Md: Story = {
    args: {
        options: basicOptions,
        size: 'md',
        placeholder: 'Select an option',
    },
};

export const Lg: Story = {
    args: {
        options: basicOptions,
        size: 'lg',
        placeholder: 'Select an option',
    },
};

export const Filled: Story = {
    args: {
        options: basicOptions,
        theme: 'filled',
        placeholder: 'Select an option',
    },
};

export const Outlined: Story = {
    args: {
        options: basicOptions,
        theme: 'outlined',
        placeholder: 'Select an option',
    },
};



