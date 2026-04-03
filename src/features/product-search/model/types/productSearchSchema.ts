export interface ProductSearchSubmittedEvent {
    id: number;
    query: string;
}

export interface ProductSearchSchema {
    query: string;
    isFocused: boolean;
    isQueryValid: boolean;
    submittedEvent: ProductSearchSubmittedEvent | null;
    nextEventId: number;
}
