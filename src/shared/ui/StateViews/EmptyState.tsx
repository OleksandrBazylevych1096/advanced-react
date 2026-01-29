import type {FC, ReactNode, SVGProps} from 'react';

import {cn} from '@/shared/lib';
import {AppIcon} from '@/shared/ui';

import styles from './StateViews.module.scss';

interface EmptyStateProps {
    icon?: FC<SVGProps<SVGSVGElement>>;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
    'data-testid'?: string;
}

export const EmptyState = ({
    icon,
    title,
    description,
    action,
    className,
    'data-testid': dataTestId = 'empty-state'
}: EmptyStateProps) => {
    return (
        <div className={cn(styles.container, className)} data-testid={dataTestId}>
            {icon && (
                <AppIcon Icon={icon} className={styles.icon} />
            )}
            <p className={styles.title}>{title}</p>
            {description && (
                <p className={styles.description}>{description}</p>
            )}
            {action}
        </div>
    );
};
