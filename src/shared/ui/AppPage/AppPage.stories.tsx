import type {Meta, StoryObj} from "@storybook/react-vite";

import {Typography} from "@/shared/ui/Typography/Typography";

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
                    Title
                </Typography>
                <Typography>Content</Typography>
            </AppPage.Content>
        </AppPage>
    ),
};
