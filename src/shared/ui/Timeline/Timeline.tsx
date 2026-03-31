import CheckedIcon from "@/shared/assets/icons/Checked.svg?react";
import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Box} from "@/shared/ui/Box";
import {Progress} from "@/shared/ui/Progress";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./Timeline.module.scss";

export type TimelineEventState = "done" | "active" | "upcoming";

export interface TimelineEvent {
    state: TimelineEventState;
    label: string;
    progress: number;
}

interface TimelineProps {
    events: TimelineEvent[];
    className?: string;
    itemClassName?: string;
}

const resolveProgress = (event: TimelineEvent): number => {
    if (event.state === "done") return 100;
    if (event.state === "upcoming") return 0;
    return event.progress;
};

export const Timeline = ({events, className, itemClassName}: TimelineProps) => {
    if (events.length === 0) return null;

    return (
        <Box className={cn(styles.timeline, className)}>
            {events.map((event, index) => {
                return (
                    <Stack
                        key={`${event.label}-${index}`}
                        direction="column"
                        gap={10}
                        className={cn(styles.item, itemClassName)}
                    >
                        <Progress
                            value={resolveProgress(event)}
                            ariaLabel={`${event.label} progress`}
                            trackClassName={styles.track}
                            fillClassName={cn(styles.fill, styles[`fill-${event.state}`])}
                        />
                        <Stack direction="row" gap={8} align="center" className={styles.event}>
                            <span
                                className={cn(styles.marker, styles[`marker-${event.state}`])}
                                aria-hidden
                            >
                                {event.state === "done" && (
                                    <AppIcon
                                        Icon={CheckedIcon}
                                        size={16}
                                        className={styles.markerIcon}
                                    />
                                )}
                            </span>
                            <Typography
                                as="span"
                                variant="body"
                                className={styles.label}
                                tone={event.state === "upcoming" ? "muted" : "default"}
                            >
                                {event.label}
                            </Typography>
                        </Stack>
                    </Stack>
                );
            })}
        </Box>
    );
};
