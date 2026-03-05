export interface VersionGuard {
    next: (key: string) => number;
    isCurrent: (key: string, version: number) => boolean;
    clear: (key: string) => void;
}

export const createVersionGuard = (): VersionGuard => {
    const versions: Record<string, number | undefined> = {};

    return {
        next: (key: string) => {
            const nextVersion = (versions[key] ?? 0) + 1;
            versions[key] = nextVersion;
            return nextVersion;
        },
        isCurrent: (key: string, version: number) => versions[key] === version,
        clear: (key: string) => {
            delete versions[key];
        },
    };
};
