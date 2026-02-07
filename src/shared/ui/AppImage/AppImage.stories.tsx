import type {Meta, StoryObj} from "@storybook/react-vite";

import {AppImage} from "./AppImage";

const meta: Meta<typeof AppImage> = {
    title: "shared/AppImage",
    component: AppImage,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div style={{width: 300, height: 300}}>
                <Story/>
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof AppImage>;

export const Default: Story = {
    args: {
        src: "https://pngimg.com/uploads/mango/mango_PNG9164.png",
        alt: "Mango",
    },
};

export const Cover: Story = {
    args: {
        src: "https://pngimg.com/uploads/mango/mango_PNG9164.png",
        alt: "Mango with cover fit",
        objectFit: "cover",
    },
};

export const Error: Story = {
    args: {
        src: "https://invalid-url.com/image.png",
        alt: "Error state",
    },
};

export const WithFallback: Story = {
    args: {
        src: "https://invalid-url.com/image.png",
        fallbackSrc: "https://pngimg.com/uploads/mango/mango_PNG9164.png",
        alt: "With fallback",
    },
};

export const NoSource: Story = {
    args: {
        alt: "No image source",
    },
};

export const NoErrorMessage: Story = {
    args: {
        src: "https://invalid-url.com/image.png",
        alt: "Error without message",
        showErrorMessage: false,
    },
};
