import type {Meta, StoryObj} from '@storybook/react-vite';

import {Accordion} from './Accordion';

const meta = {
    title: 'shared/Accordion',
    component: Accordion,
    subcomponents: {
        Item: Accordion.Item,
        Header: Accordion.Header,
        Content: Accordion.Content,
    },
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof Accordion>;


export const Default: Story = {
    args: {
        children: (
            <>
                <Accordion.Item value="item-1">
                    <Accordion.Header>Header 1</Accordion.Header>
                    <Accordion.Content>
                        Content 1
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-2">
                    <Accordion.Header>Header 2</Accordion.Header>
                    <Accordion.Content>
                        Content 2
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-3">
                    <Accordion.Header>Header 3</Accordion.Header>
                    <Accordion.Content>
                        Content 3
                    </Accordion.Content>
                </Accordion.Item>
            </>
        ),
    },
};


export const OneItemOpenByDefault: Story = {
    args: {
        defaultValue: ['item-2'],
        children: (
            <>
                <Accordion.Item value="item-1">
                    <Accordion.Header>Header 1</Accordion.Header>
                    <Accordion.Content>
                        Content 1
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-2">
                    <Accordion.Header>Header 2</Accordion.Header>
                    <Accordion.Content>
                        Content 2
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-3">
                    <Accordion.Header>Header 3</Accordion.Header>
                    <Accordion.Content>
                        Content 3
                    </Accordion.Content>
                </Accordion.Item>
            </>
        ),
    },
};

export const MultipleItemsOpenByDefault: Story = {
    args: {
        defaultValue: ['item-1', 'item-3'],
        children: (
            <>
                <Accordion.Item value="item-1">
                    <Accordion.Header>Header 1</Accordion.Header>
                    <Accordion.Content>
                        Content 1
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-2">
                    <Accordion.Header>Header 2</Accordion.Header>
                    <Accordion.Content>
                        Content 2
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-3">
                    <Accordion.Header>Header 3</Accordion.Header>
                    <Accordion.Content>
                        Content 3
                    </Accordion.Content>
                </Accordion.Item>
            </>
        ),
    },
};


export const LongContent: Story = {
    args: {
        defaultValue: ['item-1'],
        children: (
            <>
                <Accordion.Item value="item-1">
                    <Accordion.Header>Long Content</Accordion.Header>
                    <Accordion.Content>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                            enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse
                            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit
                            anim id est laborum.
                        </p>
                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                            quae ab illo inventore veritatis et quasi architecto beatae vitae
                            dicta sunt explicabo.
                        </p>
                        <p>
                            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
                            aut fugit, sed quia consequuntur magni dolores eos qui ratione
                            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
                            ipsum quia dolor sit amet, consectetur, adipisci velit.
                        </p>
                        <p>
                            Ut enim ad minima veniam, quis nostrum exercitationem ullam
                            corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                            consequatur? Quis autem vel eum iure reprehenderit qui in ea
                            voluptate velit esse quam nihil molestiae consequatur.
                        </p>
                    </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="item-2">
                    <Accordion.Header>Short content</Accordion.Header>
                    <Accordion.Content>
                        Lorem ipsum dolor sit amet
                    </Accordion.Content>
                </Accordion.Item>
            </>
        ),
    },
};

