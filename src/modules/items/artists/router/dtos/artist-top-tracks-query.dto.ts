import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export abstract class ArtistTopTracksQuery {
  @IsOptional()
  @IsInt()
  @Max(10)
  @Min(1)
  @Transform(({ value }) => Number.parseInt(value ?? 5))
  limit?: number
}
