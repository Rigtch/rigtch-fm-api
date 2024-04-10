export abstract class ItemService<TDto extends object, TEntity extends object> {
  public abstract create(
    data: TDto | string,
    additionalData?: unknown
  ): Promise<TEntity>

  public abstract findOrCreate(data: TDto | string): Promise<TEntity>
  public abstract findOrCreate(data: TDto[] | string[]): Promise<TEntity[]>
}
