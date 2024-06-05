export function createQueryBuilderFactoryMock<T>(entity?: T) {
  return vi.fn().mockReturnValue(createQueryBuilderMockImplementation(entity))
}

export function createQueryBuilderMockImplementation<T>(entity?: T) {
  return {
    orderBy: vi.fn().mockReturnThis(),
    connection: {
      createQueryBuilder: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      cache: vi.fn().mockReturnThis(),
      getRawOne: vi.fn().mockReturnThis(),
      setParameters: vi.fn().mockReturnThis(),
    },
    getParameters: vi.fn().mockReturnThis(),
    getQuery: vi.fn().mockReturnThis(),
    leftJoinAndSelect: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    take: vi.fn().mockReturnThis(),
    cache: vi.fn().mockReturnThis(),
    clone: vi.fn().mockReturnThis(),
    addOrderBy: vi.fn().mockReturnThis(),
    getMany: vi.fn().mockResolvedValue([entity, entity]),
    getManyAndCount: vi.fn().mockResolvedValue([entity, entity]),
    getOne: vi.fn().mockResolvedValue(entity),
  }
}
