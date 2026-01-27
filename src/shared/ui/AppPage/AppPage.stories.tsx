import type {Meta, StoryObj} from "@storybook/react-vite";

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
                <h1>Title</h1>
                <p>Content</p>
            </AppPage.Content>
        </AppPage>
    ),
};