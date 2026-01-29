import {useTranslation} from 'react-i18next';

import {cn} from '@/shared/lib';
import {Button} from '@/shared/ui';

import styles from './StateViews.module.scss';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
    retryText?: string;
    className?: string;
    'data-testid'?: string
}

export const ErrorState = ({
                               message,
                               onRetry,
                               retryText,
                               className,
                               'data-testid': datatestId = 'error-state'
                           }: ErrorStateProps) => {
    const {t} = useTranslation();

    return (
        <div data-testid={datatestId} className={cn(styles.container, className)}>

            <p className={styles.title}>
                {message || t('common.errorDefault')}
            </p>
            {onRetry && (
                <Button onClick={onRetry} theme="outline" size="sm">
                    {retryText || t('common.tryAgain')}
                </Button>
            )}
        </div>
    );
};
