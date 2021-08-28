// @graph-mind
// Remove the previous line to stop Ada from updating this file
import {
    OffsetPaginationInfo,
    OffsetPaginationInput,
} from '../standards/pagination';

export default function genPageInfo(
    page: OffsetPaginationInput,
    totalCount: number,
    fetchedCount: number,
): OffsetPaginationInfo {
    const pageInfo: OffsetPaginationInfo = {
        hasNextPage: false,
        hasPreviousPage: false,
        nextOffset: 0,
        previousOffset: 0,
        totalCount: 0,
        totalPages: 0,
    };

    // Should nextOffset be optional? Should we only include it if we have a next page?
    pageInfo.nextOffset = page.offset + page.limit;
    pageInfo.previousOffset = Math.max(page.offset - page.limit, 0);
    pageInfo.totalCount = totalCount;
    pageInfo.totalPages = Math.ceil(pageInfo.totalCount / (page.limit || 1));
    pageInfo.hasPreviousPage = page.offset > 0;
    pageInfo.totalCount = Number(pageInfo.totalCount);
    pageInfo.totalPages = Number(pageInfo.totalPages);
    pageInfo.hasNextPage = fetchedCount > page.limit;

    return pageInfo;
}