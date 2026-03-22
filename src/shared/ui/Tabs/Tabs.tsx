import {createContext, useContext, useState, type HTMLAttributes, type ReactNode} from "react";

import {cn} from "@/shared/lib/styling";

import {Button} from "../Button/Button";

import styles from "./Tabs.module.scss";

interface TabsContextType {
    activeTab: string;
    selectTab: (tab: string) => void;
}

interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    defaultValue: string;
    children: ReactNode;
    onChange?: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs = (props: TabsProps) => {
    const {children, defaultValue, onChange, ...rest} = props;
    const [activeTab, setActiveTab] = useState(defaultValue);

    const selectTab = (tab: string) => {
        setActiveTab(tab);
        if (onChange) {
            onChange(tab);
        }
    };

    return (
        <TabsContext.Provider value={{activeTab, selectTab}}>
            <div {...rest}>{children}</div>
        </TabsContext.Provider>
    );
};
interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

const TabsList = ({children, ...rest}: TabsListProps) => {
    return (
        <div className={styles.list} {...rest}>
            {children}
        </div>
    );
};

interface TabTriggerProps extends HTMLAttributes<HTMLButtonElement> {
    value: string;
    children: ReactNode;
    disabled?: boolean;
}

const TabTrigger = ({children, value, ...rest}: TabTriggerProps) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabTrigger must be within Tabs");

    const isActive = context.activeTab === value;

    const selectCurrentTab = () => {
        context.selectTab(value);
    };

    return (
        <Button
            {...rest}
            type="button"
            theme={isActive ? "outline" : "tertiary"}
            form="rounded"
            onClick={selectCurrentTab}
            className={cn(styles.trigger, {[styles.active]: isActive})}
        >
            {children}
        </Button>
    );
};

interface TabContentProps extends HTMLAttributes<HTMLDivElement> {
    value: string;
    children: ReactNode;
}

const TabContent = ({children, value, ...rest}: TabContentProps) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error("TabContent must be within Tabs");

    const isActive = context.activeTab === value;

    if (!isActive) return null;

    return (
        <div {...rest} className={cn(styles.content)}>
            {children}
        </div>
    );
};

Tabs.List = TabsList;
Tabs.Content = TabContent;
Tabs.Trigger = TabTrigger;
