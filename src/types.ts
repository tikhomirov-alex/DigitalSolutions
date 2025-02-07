export type Item = {
    value: number;
    isSelected: boolean;  // Состояние выбора
    sortPosition: number;  // Позиция для сортировки
    sortOffset: number; // Смещение сортировки
};

export interface GetItemsRequest {
    limit: number;
    offset: number;
    search: string;
    sortOrder: 'asc' | 'desc'
}

export interface SelectItemsRequest {
    selectedItem: number;
}

export interface SortItemsRequest {
    sortedItems: number[]; // массив значений в новом порядке
}