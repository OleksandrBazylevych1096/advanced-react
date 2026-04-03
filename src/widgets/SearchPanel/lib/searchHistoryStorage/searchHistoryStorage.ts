import {
    SEARCH_HISTORY_LIMIT,
    SEARCH_HISTORY_STORAGE_KEY,
} from "@/widgets/SearchPanel/config/constants";

interface StoredSearchHistory {
    version: 1;
    queries: string[];
}

const normalizeQuery = (query: string): string => query.trim().toLowerCase();

const sanitizeQuery = (query: string): string => query.trim();

const deduplicateQueries = (queries: string[]): string[] => {
    const map = new Map<string, string>();

    for (const query of queries) {
        const sanitizedQuery = sanitizeQuery(query);

        if (!sanitizedQuery) {
            continue;
        }

        map.set(normalizeQuery(sanitizedQuery), sanitizedQuery);
    }

    return Array.from(map.values());
};

export const getLocalSearchHistory = (): string[] => {
    try {
        const raw = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);

        if (!raw) {
            return [];
        }

        const stored = JSON.parse(raw) as StoredSearchHistory;

        if (stored.version !== 1 || !Array.isArray(stored.queries)) {
            localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
            return [];
        }

        return deduplicateQueries(stored.queries).slice(0, SEARCH_HISTORY_LIMIT);
    } catch {
        localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
        return [];
    }
};

const persistLocalSearchHistory = (queries: string[]): void => {
    try {
        const stored: StoredSearchHistory = {
            version: 1,
            queries: queries.slice(0, SEARCH_HISTORY_LIMIT),
        };

        localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(stored));
    } catch {
        // silent
    }
};

export const addLocalSearchQuery = (query: string): string[] => {
    const sanitizedQuery = sanitizeQuery(query);

    if (!sanitizedQuery) {
        return getLocalSearchHistory();
    }

    const existing = getLocalSearchHistory();
    const normalized = normalizeQuery(sanitizedQuery);
    const next = [
        sanitizedQuery,
        ...existing.filter((item) => normalizeQuery(item) !== normalized),
    ].slice(0, SEARCH_HISTORY_LIMIT);

    persistLocalSearchHistory(next);

    return next;
};

export const removeLocalSearchQuery = (query: string): string[] => {
    const normalized = normalizeQuery(query);
    const next = getLocalSearchHistory().filter((item) => normalizeQuery(item) !== normalized);

    persistLocalSearchHistory(next);

    return next;
};

export const clearLocalSearchHistory = (): void => {
    try {
        localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
    } catch {
        // silent
    }
};
