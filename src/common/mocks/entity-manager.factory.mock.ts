import { EntityManager } from 'typeorm'

export const entityManagerFactoryMock = () =>
  ({
    findOneBy: vi.fn(),
    findBy: vi.fn(),
    find: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  }) as unknown as EntityManager
