import { EntityManager } from 'typeorm'

export const transactionFactoryMock = (entityManagerMock: EntityManager) =>
  vi
    .fn()
    .mockImplementation(
      async <T>(passedFunction: (entityManager: EntityManager) => Promise<T>) =>
        await passedFunction(entityManagerMock)
    )
