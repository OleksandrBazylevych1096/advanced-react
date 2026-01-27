import {COLUMN_GAP, COLUMN_WIDTH} from "@/widgets/Catalog/consts/defaults.ts";

export const getColumnCount = (width: number) => {
    return Math.floor(width / (COLUMN_WIDTH + COLUMN_GAP)) || 1;
};

export const getRowCount = (columnsCount: number, length: number) => {
    return Math.ceil(length / columnsCount);
};
