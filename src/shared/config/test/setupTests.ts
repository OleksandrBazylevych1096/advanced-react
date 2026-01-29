import "@testing-library/jest-dom";
import {afterEach} from "vitest";

import {resetDeterministicCounter, resetSequences} from "@/shared/lib/test/createMockFactories.ts";

// Reset mock factory state between tests to ensure deterministic behavior
afterEach(() => {
    resetDeterministicCounter();
    resetSequences();
});
