export interface Response<T> {
    message: string;
    data: T;
}

export interface PaginationResponse<T> {
    message: string;
    data: T;
    meta: {
        page: number;
        per_page: number;
        total_items: number;
        total_pages: number;
        has_next: boolean;
        has_previous: boolean;
    }
}