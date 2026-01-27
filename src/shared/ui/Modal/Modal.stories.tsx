import type {Meta, StoryObj} from '@storybook/react-vite';

import {Button} from "@/shared/ui";

import {Modal} from './Modal';

const meta: Meta<typeof Modal> = {
    title: 'shared/Modal',
    component: Modal,
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
    render: () => (
        <Modal>
            <Modal.Trigger>Open Modal</Modal.Trigger>
            <Modal.Content>
                <Modal.Header>Title</Modal.Header>
                <Modal.Body>
                    Body
                </Modal.Body>
                <Modal.Footer>Footer</Modal.Footer>
            </Modal.Content>
        </Modal>
    ),
};

export const Open: Story = {
    render: () => (
        <Modal isDefaultOpen>
            <Modal.Trigger>Open Modal</Modal.Trigger>
            <Modal.Content>
                <Modal.Header>Title</Modal.Header>
                <Modal.Body>
                    Body
                </Modal.Body>
                <Modal.Footer>Footer</Modal.Footer>
            </Modal.Content>
        </Modal>
    ),
};

export const CustomTrigger: Story = {
    render: () => (
        <Modal>
            <Modal.Trigger asChild>
                <Button>Open Modal</Button>
            </Modal.Trigger>
            <Modal.Content>
                <Modal.Header>Title</Modal.Header>
                <Modal.Body>
                    <Modal.Body>
                        Body
                    </Modal.Body>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    ),
};


export const NestedModals: Story = {
    render: () => (
        <Modal isDefaultOpen>
            <Modal.Trigger>Open Modal</Modal.Trigger>
            <Modal.Content>
                <Modal.Header>Modal Title</Modal.Header>
                <Modal.Body>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
                    et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet..
                    Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum

                    <Modal isDefaultOpen>
                        <Modal.Trigger>
                            <Button>Open Modal 2</Button>
                        </Modal.Trigger>
                        <Modal.Content>
                            <Modal.Header>Modal Title 2</Modal.Header>
                            <Modal.Body>
                                <p>Nested content</p>
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    ),
};

