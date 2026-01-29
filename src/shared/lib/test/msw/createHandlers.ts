import {delay, http, type HttpHandler, HttpResponse, type JsonBodyType} from 'msw';

export interface HandlerConfig<TData extends JsonBodyType = JsonBodyType> {
    endpoint: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    defaultData: TData | (() => TData);
    errorData?: {
        error: string;
    };
    errorStatus?: number;
}

export interface HandlerVariants {
    default: HttpHandler;
    loading: HttpHandler;
    error: HttpHandler;
}

export type HandlerVariantName = keyof HandlerVariants;

export function createHandlers<TData extends JsonBodyType = JsonBodyType>(
    config: HandlerConfig<TData>
): HandlerVariants {
    const {
        endpoint,
        method = 'get',
        defaultData,
        errorData = {error: 'Request failed'},
        errorStatus = 500,
    } = config;

    const httpMethod = http[method];

    const resolveData = (): TData => {
        return typeof defaultData === 'function'
            ? (defaultData as () => TData)()
            : defaultData;
    };

    return {
        default: httpMethod(endpoint, () => {
            return HttpResponse.json(resolveData());
        }),

        loading: httpMethod(endpoint, async () => {
            await delay('infinite');
            return HttpResponse.json(resolveData());
        }),

        error: httpMethod(endpoint, () => {
            return HttpResponse.json(errorData, {status: errorStatus});
        }),
    };
}

export function extendHandlers<T extends Record<string, HttpHandler>>(
    baseHandlers: HandlerVariants,
    customHandlers: T
): HandlerVariants & T {
    return {
        ...baseHandlers,
        ...customHandlers,
    };
}