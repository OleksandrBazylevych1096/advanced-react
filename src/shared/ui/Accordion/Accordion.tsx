import {createContext, type FC, type ReactNode, useContext, useMemo, useState,} from 'react';

import ChevronRight from '@/shared/assets/icons/ChevronRight.svg?react';
import {cn} from '@/shared/lib';
import {AppIcon, Button} from '@/shared/ui';

import styles from './Accordion.module.scss';

interface AccordionContextValue {
    openItems: string[];
    toggle: (value: string) => void;
    isOpen: (value: string) => boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordion = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error(
            'Accordion compound components must be used inside Accordion ',
        );
    }
    return context;
};


const AccordionItemContext = createContext<string | null>(null);

const useAccordionItem = () => {
    const value = useContext(AccordionItemContext);
    if (!value) {
        throw new Error(
            'Accordion.Header and Accordion.Content must be used inside Accordion.Item',
        );
    }
    return value;
};

interface AccordionProps {
    children: ReactNode;
    defaultValue?: string[];
    className?: string
}

export const Accordion: FC<AccordionProps> & {
    Item: typeof AccordionItem;
    Header: typeof AccordionHeader;
    Content: typeof AccordionContent;
} = ({children, defaultValue = [], className}) => {
    const [openItems, setOpenItems] = useState<string[]>(defaultValue);

    const toggle = (value: string) => {
        setOpenItems(prev =>
            prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value],
        );
    };

    const contextValue = useMemo(
        () => ({
            openItems,
            toggle,
            isOpen: (value: string) => openItems.includes(value),
        }),
        [openItems],
    );

    return (
        <AccordionContext.Provider value={contextValue}>
            <div className={cn(styles.accordion, className)}>{children}</div>
        </AccordionContext.Provider>
    );
};

interface AccordionItemProps {
    value: string;
    children: ReactNode;
    className?: string
}

const AccordionItem: FC<AccordionItemProps> = ({value, children, className}) => {
    return (
        <AccordionItemContext.Provider value={value}>
            <div className={cn(styles.item, className)} data-value={value}>
                {children}
            </div>
        </AccordionItemContext.Provider>
    );
};

interface AccordionHeaderProps {
    children: ReactNode;
    className?: string

}

const AccordionHeader: FC<AccordionHeaderProps> = ({children, className}) => {
    const {toggle, isOpen} = useAccordion();
    const value = useAccordionItem();

    const opened = isOpen(value);

    return (
        <Button
            type="button"
            theme="ghost"
            className={cn(styles.header, className, {[styles.open]: opened})}
            onClick={() => toggle(value)}
            aria-expanded={opened}

        >
            {children}

            <AppIcon
                Icon={ChevronRight}
                className={cn(styles.icon, {[styles.open]: opened})}
            />
        </Button>
    );
};

interface AccordionContentProps {
    children: ReactNode;
    className?: string
}

const AccordionContent: FC<AccordionContentProps> = ({children, className}) => {
    const {isOpen} = useAccordion();
    const value = useAccordionItem();

    const opened = isOpen(value);

    return (
        <div
            className={cn(styles.content, {[styles.open]: opened})}
            aria-hidden={!opened}
        >
            <div className={cn(styles.contentInner, className)}>{children}</div>
        </div>
    );
};

Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Content = AccordionContent;
