import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

import { AlbumsRepository } from './albums.repository'
import { Album } from './album.entity'
import { CreateAlbum } from './dtos'

import { ApiAuth, Token } from '@modules/auth/decorators'
import { NOT_BEEN_FOUND } from '@common/constants'

@Controller('albums')
@ApiTags('albums')
@ApiAuth()
export class AlbumsController {
  constructor(private readonly albumsRepository: AlbumsRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all albums.',
  })
  @ApiQuery({ name: 'name', required: false })
  @ApiOkResponse({
    description: 'Albums successfully found.',
    type: [Album],
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('album'),
  })
  async getAll(@Query('name') name?: string, @Token() _token?: string) {
    if (name) {
      const foundAlbum = await this.albumsRepository.findOne({
        where: { name },
      })

      if (!foundAlbum) throw new NotFoundException(NOT_BEEN_FOUND('album'))

      return foundAlbum
    }

    return this.albumsRepository.find()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Getting an album by id.',
  })
  @ApiOkResponse({
    description: 'Album successfully found.',
    type: Album,
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('album'),
  })
  async getOne(@Query('id') id: string, @Token() _token?: string) {
    const foundAlbum = await this.albumsRepository.findOne({ where: { id } })

    if (!foundAlbum) throw new NotFoundException(NOT_BEEN_FOUND('album'))

    return foundAlbum
  }

  @Post()
  @ApiOperation({
    summary: 'Creating an album.',
  })
  @ApiCreatedResponse({
    description: 'Album successfully created.',
    type: Album,
  })
  @ApiConflictResponse({
    description: 'Album already exists.',
  })
  async create(@Body() newAlbum: CreateAlbum, @Token() _token?: string) {
    const foundAlbum = await this.albumsRepository.findOne({
      where: { externalId: newAlbum.id },
    })

    if (foundAlbum) throw new ConflictException('Album already exists.')

    return this.albumsRepository.createAlbum(newAlbum)
  }
}
