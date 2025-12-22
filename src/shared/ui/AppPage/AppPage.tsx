import type {ReactNode} from "react";

import {cn} from "@/shared/lib";

import styles from './AppPage.module.scss'

interface AppPageProps {
    children: ReactNode
    className?: string
}

export const AppPage = (props: AppPageProps) => {
    const {children, className} = props
    return (
        <div className={cn(styles.pageWrapper, className)}>{children}</div>
    );
}

interface AppPageProps {
    children: ReactNode
    className?: string
}

export const AppContent = (props: AppPageProps) => {
    const {children, className} = props
    return <main className={cn(styles.content, className)}>{children}</main>
}

AppPage.Content = AppContent