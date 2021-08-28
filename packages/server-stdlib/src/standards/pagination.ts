// @graph-mind
// Remove the previous line to stop Ada from updating this file
export interface OffsetPaginationInput {
    offset: number;
    limit: number;
}
export interface OffsetPaginationInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    totalPages?: number;
    nextOffset?: number;
    previousOffset?: number;
}

export interface CursorPaginationInput {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
}
export interface CursorPaginationInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
    startCursor: string;
    endCursor: string;
}