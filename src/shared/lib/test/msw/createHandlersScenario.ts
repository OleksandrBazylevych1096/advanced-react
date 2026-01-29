import type {HttpHandler} from 'msw';

import type {HandlerVariants} from "@/shared/lib/test/msw/createHandlers.ts";


type ScenarioName = keyof HandlerVariants;

export function createHandlersScenario<T extends Record<string, HandlerVariants>
>(
    scenarioName: ScenarioName,
    handlerSets: T,
    overrides?: Partial<Record<keyof T, HttpHandler>>
): HttpHandler[] {
    const handlers: HttpHandler[] = [];

    for (const key in handlerSets) {
        const handlerSet = handlerSets[key];
        const override = overrides?.[key];

        if (override) {
            handlers.push(override);
            continue;
        }

        handlers.push(handlerSet[scenarioName]);
    }

    return handlers;
}


export function withOverrides(
    baseHandlers: HttpHandler[],
    ...overrides: HttpHandler[]
): HttpHandler[] {
    return [...baseHandlers, ...overrides];
}

