export function paginationOptionsToQueryOptions({
  page,
  pageSize,
}: PaginationOptions) {
  return {
    take: pageSize || 10,
    ...(page && { skip: (page - 1) * (pageSize || 10) }),
  };
}
