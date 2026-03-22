import type {Meta, StoryObj} from "@storybook/react-vite";

import {Button} from "@/shared/ui/Button";
import {Dropdown} from "@/shared/ui/Dropdown/Dropdown.tsx";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

const meta = {
    title: "shared/Dropdown",
    component: Dropdown,
    parameters: {layout: "centered"},
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: undefined,
    },
    render: () => (
        <Dropdown>
            <Dropdown.Trigger>Open menu</Dropdown.Trigger>
            <Dropdown.Content>
                <Dropdown.Header>
                    <Typography variant="bodySm" weight="semibold">
                        Menu
                    </Typography>
                </Dropdown.Header>
                <Dropdown.Body>
                    <Stack gap={8}>
                        <Button size="sm" theme="ghost">
                            Profile
                        </Button>
                        <Button size="sm" theme="ghost">
                            Settings
                        </Button>
                    </Stack>
                </Dropdown.Body>
            </Dropdown.Content>
        </Dropdown>
    ),
};
