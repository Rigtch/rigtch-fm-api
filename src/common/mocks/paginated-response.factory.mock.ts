import { IPaginationOptions } from 'nestjs-typeorm-paginate'

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

export function paginatedResponseMockImplementation<T>(item: T) {
  return (_: unknown, { limit, page }: IPaginationOptions) => {
    return Promise.resolve(
      generatePaginatedResponseFactoryMock(item, +limit, +page)
    )
  }
}
