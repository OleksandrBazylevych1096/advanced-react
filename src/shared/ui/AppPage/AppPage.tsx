import type {ReactNode} from "react";

import {cn} from "@/shared/lib";
import {Container} from "@/shared/ui/Container/Container";

import styles from "./AppPage.module.scss";

interface AppPageProps {
    children: ReactNode;
    className?: string;
}

type AppPageComponent = ((props: AppPageProps) => ReactNode) & {
    Content: (props: AppPageProps) => ReactNode;
};

const AppContent = (props: AppPageProps) => {
    const {children, className} = props;

    return (
        <Container as="main" className={cn(styles.content, className)} size="content">
            {children}
        </Container>
    );
};

export const AppPage: AppPageComponent = (props) => {
    const {children, className} = props;

    return <div className={cn(styles.pageWrapper, className)}>{children}</div>;
};

AppPage.Content = AppContent;
