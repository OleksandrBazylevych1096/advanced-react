import type {Meta, StoryObj} from '@storybook/react-vite';

import {Carousel} from './Carousel';

const meta: Meta<typeof Carousel> = {
    title: 'shared/Carousel',
    component: Carousel,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const slideBaseStyles = {
    width: '930px',
    borderRadius: '8px',
    padding: '40px 20px',
    textAlign: 'center' as const,
    fontSize: '24px',
    fontWeight: 'bold' as const,
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
};

const cardStyles = {
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '20px',
    minWidth: '460px',
    height: '150px',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '20px',
    fontWeight: 'bold' as const,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

export const Default: Story = {
    render: () => (
        <Carousel>
            <div style={{...slideBaseStyles, background: '#ff6b6b'}}>
                Slide 1
            </div>
            <div style={{...slideBaseStyles, background: '#4ecdc4'}}>
                Slide 2
            </div>
            <div style={{...slideBaseStyles, background: '#45b7d1'}}>
                Slide 3
            </div>
            <div style={{...slideBaseStyles, background: '#f9ca24'}}>
                Slide 4
            </div>
            <div style={{...slideBaseStyles, background: '#95e1d3'}}>
                Slide 5
            </div>
        </Carousel>
    ),
};

export const MultipleSlidesVisible: Story = {
    render: () => (
        <Carousel
            options={{
                align: 'start',
                slidesToScroll: 1,
            }}
        >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <div
                    key={num}
                    style={{
                        ...cardStyles,
                        background: `hsl(${num * 45}, 70%, 60%)`,
                    }}
                >
                    Slide {num}
                </div>
            ))}
        </Carousel>
    ),
};

export const DragInteraction: Story = {
    render: () => (
        <Carousel
            options={{
                align: 'center',
                dragFree: true,
            }}
        >
            <div style={{...slideBaseStyles, background: '#ff6b6b'}}>
                Slide 1
            </div>
            <div style={{...slideBaseStyles, background: '#4ecdc4'}}>
                Slide 2
            </div>
            <div style={{...slideBaseStyles, background: '#45b7d1'}}>
                Slide 3
            </div>
            <div style={{...slideBaseStyles, background: '#f9ca24'}}>
                Slide 4
            </div>
            <div style={{...slideBaseStyles, background: '#95e1d3'}}>
                Slide 5
            </div>
        </Carousel>
    ),
};

export const Loop: Story = {
    render: () => (
        <Carousel
            options={{
                loop: true,
                align: 'start',
            }}
        >
            <div style={{...slideBaseStyles, background: '#ff6b6b'}}>
                Slide 1
            </div>
            <div style={{...slideBaseStyles, background: '#4ecdc4'}}>
                Slide 2
            </div>
            <div style={{...slideBaseStyles, background: '#45b7d1'}}>
                Slide 3
            </div>
            <div style={{...slideBaseStyles, background: '#f9ca24'}}>
                Slide 4
            </div>
            <div style={{...slideBaseStyles, background: '#95e1d3'}}>
                Slide 5
            </div>
        </Carousel>
    ),
};

export const VariableSlideWidth: Story = {
    render: () => {
        const variableSlideStyles = {
            borderRadius: '8px',
            padding: '20px',
            height: '120px',
            display: 'flex',
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            fontWeight: 'bold' as const,
        };

        return (
            <Carousel
                options={{
                    align: 'start',
                    containScroll: 'trimSnaps',
                }}
            >
                <div style={{...variableSlideStyles, background: '#ff6b6b', minWidth: '150px'}}>
                    Slide 1
                </div>
                <div style={{...variableSlideStyles, background: '#4ecdc4', minWidth: '300px'}}>
                    Slide 2
                </div>
                <div style={{...variableSlideStyles, background: '#45b7d1', minWidth: '200px'}}>
                    Slide 3
                </div>
                <div style={{...variableSlideStyles, background: '#f9ca24', minWidth: '400px'}}>
                    Slide 4
                </div>
                <div style={{...variableSlideStyles, background: '#95e1d3', minWidth: '180px'}}>
                    Slide 5
                </div>
            </Carousel>
        );
    },
};