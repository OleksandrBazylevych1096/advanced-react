import type {RefObject} from "react";

type ControllerAction = (...args: never[]) => unknown;
type ControllerRef = RefObject<unknown>;

export interface ControllerStatus {
    isLoading?: boolean;
    isFetching?: boolean;
    isSubmitting?: boolean;
    error?: unknown;
    [key: string]: unknown;
}

export interface ControllerResult {
    data?: Record<string, unknown>;
    actions?: Record<string, ControllerAction>;
    status?: ControllerStatus;
    derived?: Record<string, unknown>;
    refs?: Record<string, ControllerRef>;
}

export const createControllerResult = <const TControllerResult>(
    controllerResult: TControllerResult & ControllerResult,
): TControllerResult => controllerResult;
