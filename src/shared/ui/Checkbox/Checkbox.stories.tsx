import type {Meta, StoryObj} from '@storybook/react-vite';

import {Checkbox} from './Checkbox';

const meta: Meta<typeof Checkbox> = {
    title: 'shared/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: {
        label: 'Default',
        checked: false,
    },
};

export const Checked: Story = {
    args: {
        label: 'Checked',
        checked: true,
    },
};

export const DisabledUnchecked: Story = {
    args: {
        label: 'Disabled option',
        checked: false,
        disabled: true,
    },
};

export const DisabledChecked: Story = {
    args: {
        label: 'Disabled and checked',
        checked: true,
        disabled: true,
    },
};

export const ReadOnlyUnchecked: Story = {
    args: {
        label: 'Read-only option',
        checked: false,
        readOnly: true,
    },
};

export const ReadOnlyChecked: Story = {
    args: {
        label: 'Read-only and checked',
        checked: true,
        readOnly: true,
    },
};

export const WithoutLabel: Story = {
    args: {
        checked: false,
    },
};