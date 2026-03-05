import type {Meta, StoryObj} from "@storybook/react-vite";

import {Stack} from "@/shared/ui/Stack/Stack";

import {Typography} from "./Typography";

const meta: Meta<typeof Typography> = {
    title: "shared/Typography",
    component: Typography,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Heading: Story = {
    args: {
        as: "h2",
        variant: "heading",
        children: "Heading text",
    },
};

export const BodyMuted: Story = {
    args: {
        variant: "bodySm",
        tone: "muted",
        children: "Muted body text",
    },
};

export const Bold: Story = {
    args: {
        variant: "body",
        weight: "bold",
        children: "Bold body text",
    },
};

export const Scale: Story = {
    render: () => (
        <Stack gap={8}>
            <Typography variant="display">Display</Typography>
            <Typography as="h3" variant="heading">
                Heading
            </Typography>
            <Typography variant="body">Body</Typography>
            <Typography variant="bodySm">Body small</Typography>
            <Typography variant="caption">Caption</Typography>
        </Stack>
    ),
};
