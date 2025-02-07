export type Item = {
    value: number;
    isSelected: boolean;
    sortPosition: number;
};

export interface GetItemsRequest {
    limit: number;
    offset: number;
    search: string;
    sortOrder: 'asc' | 'desc';
}

export interface SelectItemsRequest {
    selectedItems: number[];
}

export interface SortItemsRequest {
    sortedItems: number[];
}
