import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

import { ArtistsRepository } from './artists.repository'
import { Artist } from './artist.entity'
import { CreateArtist } from './dtos'

import { ApiAuth, Token } from '@modules/auth/decorators'
import { NOT_BEEN_FOUND, ONE_IS_INVALID } from '@common/constants'

@Controller('artists')
@ApiTags('artists')
@ApiAuth()
export class ArtistsController {
  constructor(private readonly artistsRepository: ArtistsRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all artists.',
  })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'external-id', required: false })
  @ApiOkResponse({
    description: 'Artists successfully found.',
    type: [Artist],
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('artist'),
  })
  async getArtists(
    @Query('name') name?: string,
    @Query('external-id') externalId?: string,
    @Token() _token?: string
  ) {
    if (name) {
      const foundArtist = await this.artistsRepository.findArtistByName(name)

      if (!foundArtist) throw new NotFoundException(NOT_BEEN_FOUND('artist'))

      return foundArtist
    }

    if (externalId) {
      const foundArtist =
        await this.artistsRepository.findArtistByExternalId(externalId)

      if (!foundArtist) throw new NotFoundException(NOT_BEEN_FOUND('artist'))

      return foundArtist
    }

    return this.artistsRepository.findArtists()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Getting an artist by id.',
  })
  @ApiOkResponse({
    description: 'Artist successfully found.',
    type: Artist,
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('artist'),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getArtistById(@Param('id') id: string, @Token() _token?: string) {
    const foundArtist = await this.artistsRepository.findArtistByExternalId(id)

    if (!foundArtist) throw new NotFoundException(NOT_BEEN_FOUND('artist'))

    return foundArtist
  }

  @Post()
  @ApiOperation({
    summary: 'Creating an artist.',
  })
  @ApiCreatedResponse({
    description: 'Artist successfully created.',
    type: Artist,
  })
  @ApiConflictResponse({
    description: 'Artist already exists.',
  })
  async create(@Body() newArtist: CreateArtist, @Token() _token?: string) {
    const foundArtist = await this.artistsRepository.findArtistByExternalId(
      newArtist.id
    )

    if (foundArtist) throw new ConflictException('Artist already exists.')

    return this.artistsRepository.createArtist(newArtist)
  }
}
