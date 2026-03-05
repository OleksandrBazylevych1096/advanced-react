export interface Debounce {
    run: (callback: () => void) => void;
    cancel: () => void;
}

export const debounceCallback = (delayMs: number): Debounce => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const cancel = () => {
        if (!timer) return;
        clearTimeout(timer);
        timer = null;
    };

    const run = (callback: () => void) => {
        cancel();
        timer = setTimeout(() => {
            timer = null;
            callback();
        }, delayMs);
    };

    return {
        run,
        cancel,
    };
};
