import type {CSSProperties} from "react";
import {Fragment} from "react";

import CheckedIcon from "@/shared/assets/icons/Checked.svg?react";
import CloseIcon from "@/shared/assets/icons/Close.svg?react";
import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Box} from "@/shared/ui/Box";
import {Typography} from "@/shared/ui/Typography";

import styles from "./Timeline.module.scss";

export type TimelineEventState = "done" | "upcoming";
export type TimelineEventTone = "default" | "danger";
export type TimelineEventMarker = "default" | "cancelled";

export interface TimelineEvent {
    id: string;
    state: TimelineEventState;
    label: string;
    progress: number;
    tone?: TimelineEventTone;
    marker?: TimelineEventMarker;
    note?: string;
    isActive?: boolean;
}

interface TimelineProps {
    events: TimelineEvent[];
    className?: string;
    itemClassName?: string;
}

export const Timeline = ({events, className, itemClassName}: TimelineProps) => {
    if (events.length === 0) return null;

    const cols = events.map((_, i) => (i < events.length - 1 ? "18px 1fr" : "18px")).join(" ");

    return (
        <Box
            className={cn(styles.timeline, className)}
            style={{"--timeline-cols": cols} as CSSProperties}
        >
            {events.map((event, index) => {
                const isLast = index === events.length - 1;
                const markerTone = event.tone ?? "default";
                const connectorTone = markerTone === "danger" ? "danger" : "default";
                const isCancelledMarker = event.marker === "cancelled";
                const shouldRenderMarkerIcon = event.state === "done" || isCancelledMarker;
                const MarkerIcon = isCancelledMarker ? CloseIcon : CheckedIcon;

                return (
                    <Fragment key={event.id}>
                        <span
                            className={cn(
                                styles.marker,
                                styles[`marker-${event.state}`],
                                styles[`marker-${markerTone}`],
                                {[styles["marker-cancelled"]]: isCancelledMarker},
                                itemClassName,
                            )}
                            aria-hidden
                        >
                            {shouldRenderMarkerIcon && (
                                <AppIcon
                                    Icon={MarkerIcon}
                                    size={16}
                                    className={styles.markerIcon}
                                />
                            )}
                        </span>
                        {!isLast && (
                            <span
                                className={cn(
                                    styles.connector,
                                    styles[`connector-${connectorTone}`],
                                )}
                                aria-hidden
                            >
                                <span
                                    className={styles.connectorFill}
                                    style={
                                        {
                                            "--connector-progress": `${event.progress}%`,
                                        } as CSSProperties
                                    }
                                />
                            </span>
                        )}
                    </Fragment>
                );
            })}

            {events.map((event, index) => {
                const isFirst = index === 0;
                const isLast = index === events.length - 1;
                const position = isFirst ? "first" : isLast ? "last" : "middle";

                return (
                    <Fragment key={`label-${event.id}`}>
                        <div className={cn(styles.labelCell, styles[`labelCell-${position}`])}>
                            <Typography
                                as="span"
                                variant="body"
                                className={cn(styles.label, styles[`label-${position}`])}
                                tone={
                                    event.state === "upcoming" && event.progress === 0
                                        ? "muted"
                                        : "default"
                                }
                            >
                                {event.label}
                            </Typography>
                            {event.note && !event.isActive && (
                                <Typography
                                    as="span"
                                    variant="caption"
                                    tone="muted"
                                    className={cn(styles.note, styles[`note-${position}`])}
                                >
                                    {event.note}
                                </Typography>
                            )}
                        </div>
                        {!isLast && <span aria-hidden />}
                    </Fragment>
                );
            })}
        </Box>
    );
};
