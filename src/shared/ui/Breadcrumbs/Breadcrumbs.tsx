import type {ReactNode} from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router";

import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";

import styles from "./Breadcrumbs.module.scss";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[] | undefined;
    className?: string;
    Separator?: ReactNode;
}

export const Breadcrumbs = ({items, className, Separator = "/"}: BreadcrumbsProps) => {
    const {t} = useTranslation();
    const getLocalizedPath = useLocalizedRoutePath();
    const homePath = getLocalizedPath(routePaths[AppRoutes.HOME]);

    if (!items?.length) return null;

    return (
        <nav className={`${styles.root} ${className ?? ""}`}>
            <ol className={styles.list}>
                <li className={styles.item}>
                    <Link to={homePath} className={styles.link}>
                        {t("breadcrumbs.home")}
                    </Link>
                    <span className={styles.separator}>{Separator}</span>
                </li>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isLink = !isLast && !!item.href;

                    return (
                        <li key={index} className={styles.item}>
                            {isLink && (
                                <Link to={item.href!} className={styles.link}>
                                    {item.label}
                                </Link>
                            )}

                            {!isLink && isLast && (
                                <span className={styles.current}>{item.label}</span>
                            )}

                            {!isLink && !isLast && (
                                <span className={styles.text}>{item.label}</span>
                            )}

                            {!isLast && <span className={styles.separator}>{Separator}</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
