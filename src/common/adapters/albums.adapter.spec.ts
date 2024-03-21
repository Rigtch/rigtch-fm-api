import { Test } from '@nestjs/testing'

import { AlbumsAdapter } from './albums.adapter'
import { TracksAdapter } from './tracks.adapter'
import { ArtistsAdapter } from './artists.adapter'
import { PageAdapter } from './page.adapter'

import {
  albumsMock,
  sdkSimplifiedAlbumsMock,
  simplifiedAlbumMock,
  simplifiedAlbumsMock,
} from '@common/mocks'
import {
  sdkAlbumMock,
  albumMock,
  sdkSimplifiedAlbumMock,
  sdkAlbumsMock,
} from '@common/mocks'

describe('AlbumsAdapter', () => {
  let albumsAdapter: AlbumsAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TracksAdapter, ArtistsAdapter, AlbumsAdapter, PageAdapter],
    }).compile()

    albumsAdapter = module.get(AlbumsAdapter)
  })

  test('should be defined', () => {
    expect(albumsAdapter).toBeDefined()
  })

  test('should adapt a single album', () => {
    expect(albumsAdapter.adapt(sdkAlbumMock)).toEqual(albumMock)
  })

  test('should adapt a single simplified album', () => {
    expect(albumsAdapter.adapt(sdkSimplifiedAlbumMock)).toEqual(
      simplifiedAlbumMock
    )
  })

  test('should adapt an array of albums', () => {
    expect(albumsAdapter.adapt(sdkAlbumsMock)).toEqual(albumsMock)
  })

  test('should adapt an array of simplified albums', () => {
    expect(albumsAdapter.adapt(sdkSimplifiedAlbumsMock)).toEqual(
      simplifiedAlbumsMock
    )
  })
})
