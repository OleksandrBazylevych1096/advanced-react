import {cn} from "@/shared/lib";

import styles from "./Spinner.module.scss";

type SpinnerSize = "lg" | "md" | "sm";
type SpinnerTheme = "primary" | "secondary";

interface SpinnerProps {
    size?: SpinnerSize;
    theme?: SpinnerTheme;
    'data-testid'?: string
}

export const Spinner = (props: SpinnerProps) => {
    const {size = "md", theme = "primary", "data-testid": dataTestId = 'spinner'} = props;
    return (
        <div data-testid={dataTestId} className={cn(styles.spinner, styles[theme], styles[size])}></div>
    );
};
