import type {ReactNode} from "react";
import {Link} from "react-router"

import styles from './Breadcrumbs.module.scss'

export interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[] | undefined
    className?: string
    Separator?: ReactNode
}

export const Breadcrumbs = ({items, className, Separator = '/'}: BreadcrumbsProps) => {
    if (!items?.length) return null

    return (
        <nav className={`${styles.root} ${className ?? ""}`}>
            <ol className={styles.list}>
                <li className={styles.item}>
                    <Link to="/" className={styles.link}>
                        Home
                    </Link>
                    <span className={styles.separator}>{Separator}</span>
                </li>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1
                    const isLink = !isLast && !!item.href

                    return (
                        <li key={index} className={styles.item}>
                            {isLink && (
                                <Link to={item.href!} className={styles.link}>
                                    {item.label}
                                </Link>
                            )}

                            {!isLink && isLast && (
                                <span className={styles.current}>
                                    {item.label}
                                </span>
                            )}

                            {!isLink && !isLast && (
                                <span className={styles.text}>
                                    {item.label}
                                </span>
                            )}

                            {!isLast && (
                                <span className={styles.separator}>{Separator}</span>
                            )}
                        </li>
                    )
                })}


            </ol>
        </nav>
    )
}
