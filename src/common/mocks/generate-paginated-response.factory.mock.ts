export function generatePaginatedResponseFactoryMock<T>(
  item: T,
  limit = 10,
  page = 1
) {
  const items = Array.from({ length: limit }, () => item)

  return {
    items: items,
    meta: {
      itemCount: items.length,
      totalItems: 0,
      itemsPerPage: limit,
      totalPages: 0,
      currentPage: page,
    },
  }
}
