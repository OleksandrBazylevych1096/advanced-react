import type {Meta, StoryObj} from '@storybook/react-vite';

import {RangeSlider} from './RangeSlider';

const meta: Meta<typeof RangeSlider> = {
    title: 'shared/RangeSlider',
    component: RangeSlider,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RangeSlider>;

export const Default: Story = {
    args: {
        min: 0,
        max: 100,
        defaultValue: [20, 80],
    },
};

export const WithLabel: Story = {
    args: {
        min: 0,
        max: 100,
        defaultValue: [25, 75],
        label: 'Label',
    },
};

export const CustomRange: Story = {
    args: {
        min: 0,
        max: 1000,
        step: 10,
        defaultValue: [200, 800],
    },
};

export const SmallStep: Story = {
    args: {
        min: 0,
        max: 10,
        step: 0.5,
        defaultValue: [2.5, 7.5],
    },
};

export const WithMinRange: Story = {
    args: {
        min: 0,
        max: 100,
        minRange: 20,
        defaultValue: [30, 70],
    },
};

export const Disabled: Story = {
    args: {
        min: 0,
        max: 100,
        defaultValue: [30, 70],
        disabled: true,
    },
};

export const TooltipAlways: Story = {
    args: {
        min: 0,
        max: 100,
        defaultValue: [25, 75],
        tooltip: 'always',
    },
};

export const TooltipNever: Story = {
    args: {
        min: 0,
        max: 100,
        defaultValue: [25, 75],
        tooltip: 'never',
    },
};

export const TooltipBottom: Story = {
    args: {
        min: 0,
        max: 100,
        defaultValue: [25, 75],
        tooltip: 'always',
        tooltipPlacement: 'bottom',
    },
};

export const FullRange: Story = {
    args: {
        min: 0,
        max: 100,
        defaultValue: [0, 100],
    },
};

export const NarrowRange: Story = {
    args: {
        min: 0,
        max: 100,
        defaultValue: [48, 52],
    },
};