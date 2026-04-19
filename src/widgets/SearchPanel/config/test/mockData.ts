import type {SearchHistoryItem} from "../../model/types/searchHistory";

export const mockSearchHistoryItems: SearchHistoryItem[] = [
    {id: "h1", query: "milk", createdAt: "2026-01-01T00:00:00.000Z"},
    {id: "h2", query: "bread", createdAt: "2026-01-01T00:00:00.000Z"},
];

export const mockPopularSearches: string[] = ["bananas", "coffee", "cheese"];
