export interface FilterMenuOptionType {
    key: string;
    field: 'name' | 'min_price';
    order: 'asc' | 'desc';
    label: string;
}

export const FilterMenuOptions: FilterMenuOptionType[] =  [
    { key: 'name-asc', field: 'name', order: 'asc', label: "Name (A - Z)" },
    { key: 'name-desc', field: 'name', order: 'desc', label: "Name (Z - A)" },
    { key: 'price-asc', field: 'min_price', order: 'asc', label: "Price (Low to High)" },
    { key: 'price-desc', field: 'min_price', order: 'desc', label: "Price (High to Low)" }
];
