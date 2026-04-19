import type {Meta, StoryObj} from "@storybook/react-vite";

import {Typography} from "@/shared/ui/Typography";

import {AppPage} from "./AppPage";

const meta: Meta<typeof AppPage> = {
    title: "shared/AppPage",
    component: AppPage,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppPage>;

export const Default: Story = {
    render: () => (
        <AppPage>
            <AppPage.Content>
                <Typography as="h1" variant="display" weight="bold">
                    Checkout
                </Typography>
                <Typography>Page-level wrapper around routed content.</Typography>
            </AppPage.Content>
        </AppPage>
    ),
};

export const WithCustomWrapperClass: Story = {
    render: () => (
        <AppPage className="story-custom-page-wrapper">
            <AppPage.Content>
                <Typography as="h2" variant="heading" weight="semibold">
                    Custom wrapper class
                </Typography>
            </AppPage.Content>
        </AppPage>
    ),
};
