import { Test, type TestingModule } from '@nestjs/testing'
import { type MockProxy, mock } from 'vitest-mock-extended'
import { MockInstance } from 'vitest'

import { StatsRigtchService } from './stats-rigtch.service'
import { StatsMeasurement } from './enums'

import {
  type HistoryTrack,
  HistoryTracksRepository,
} from '@modules/history/tracks'
import { userMock } from '@common/mocks'
import {
  getMostFrequentItems,
  getMostListenedItemsByDuration,
} from '@common/utils'
import type { Track } from '@modules/items/tracks'
import type { Artist } from '@modules/items/artists'
import type { Album } from '@modules/items/albums'

vi.mock('@common/utils')

describe('StatsRigtchService', () => {
  const date = new Date()

  let moduleRef: TestingModule
  let statsRigtchService: StatsRigtchService
  let historyTracksRepository: HistoryTracksRepository

  let findByUserAndBetweenDatesSpy: MockInstance
  let getMostFrequentItemsSpy: MockInstance
  let getMostListenedItemsByDurationSpy: MockInstance

  let historyTracksMock: MockProxy<HistoryTrack>[]

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        StatsRigtchService,
        {
          provide: HistoryTracksRepository,
          useValue: {
            findByUserAndBetweenDates: vi.fn(),
          },
        },
      ],
    }).compile()

    statsRigtchService = moduleRef.get(StatsRigtchService)
    historyTracksRepository = moduleRef.get(HistoryTracksRepository)

    findByUserAndBetweenDatesSpy = vi.spyOn(
      historyTracksRepository,
      'findByUserAndBetweenDates'
    )
    getMostFrequentItemsSpy = vi.mocked(getMostFrequentItems)
    getMostListenedItemsByDurationSpy = vi.mocked(
      getMostListenedItemsByDuration
    )

    historyTracksMock = Array.from({ length: 20 }, (_, index) =>
      mock<HistoryTrack>({
        track: {
          id: `id-${index}`,
          artists: Array.from({ length: 2 }, (_, index) => ({
            id: `id-artist-${index}`,
          })),
          album: {
            id: `id-album-${index}`,
          },
        },
      })
    )
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(statsRigtchService).toBeDefined()
  })

  describe('getTopTracks', () => {
    const relations = {
      track: {
        artists: true,
        album: true,
      },
    }

    let result: Track[]

    beforeEach(() => {
      result = historyTracksMock.slice(0, 10).map(({ track }) => track)
    })

    test('should get top tracks with plays measurement', async () => {
      getMostFrequentItemsSpy.mockReturnValue(
        result.map(({ id }) => ({
          item: id,
          count: 1,
        }))
      )
      findByUserAndBetweenDatesSpy.mockResolvedValue(historyTracksMock)

      expect(
        await statsRigtchService.getTopTracks(
          {
            before: date,
            after: date,
            limit: 10,
            measurement: StatsMeasurement.PLAYS,
          },
          userMock
        )
      ).toMatchObject(
        historyTracksMock.slice(0, 10).map(({ track }) => ({
          item: track,
          plays: 1,
        }))
      )

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        date,
        date,
        relations
      )
      expect(getMostFrequentItemsSpy).toHaveBeenCalled()
      expect(getMostListenedItemsByDurationSpy).not.toHaveBeenCalled()
    })

    test('should get top tracks with play time measurement', async () => {
      getMostListenedItemsByDurationSpy.mockReturnValue(
        result.map(({ id }) => ({
          id,
          totalDuration: 1,
        }))
      )
      findByUserAndBetweenDatesSpy.mockResolvedValue(historyTracksMock)

      expect(
        await statsRigtchService.getTopTracks(
          {
            before: date,
            after: date,
            limit: 10,
            measurement: StatsMeasurement.PLAY_TIME,
          },
          userMock
        )
      ).toMatchObject(
        historyTracksMock.slice(0, 10).map(({ track }) => ({
          item: track,
          playtime: 1,
        }))
      )

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        date,
        date,
        relations
      )
      expect(getMostListenedItemsByDurationSpy).toHaveBeenCalled()
    })
  })

  describe('getTopArtists', () => {
    const relations = {
      track: {
        artists: true,
      },
    }

    let result: Artist[]

    beforeEach(() => {
      result = historyTracksMock
        .flatMap(({ track: { artists } }) => artists)
        .slice(0, 10)
    })

    test('should get top artists with plays measurement', async () => {
      getMostFrequentItemsSpy.mockReturnValue(
        result.map(({ id }) => ({
          item: id,
          count: 1,
        }))
      )
      findByUserAndBetweenDatesSpy.mockResolvedValue(historyTracksMock)

      expect(
        await statsRigtchService.getTopArtists(
          {
            before: date,
            after: date,
            limit: 10,
            measurement: StatsMeasurement.PLAYS,
          },
          userMock
        )
      ).toMatchObject(
        result.map(item => ({
          item: item,
          plays: 1,
        }))
      )

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        date,
        date,
        relations
      )
      expect(getMostFrequentItemsSpy).toHaveBeenCalled()
    })

    test('should get top artists with play time measurement', async () => {
      getMostListenedItemsByDurationSpy.mockReturnValue(
        result.map(({ id }) => ({
          id,
          totalDuration: 1,
        }))
      )

      findByUserAndBetweenDatesSpy.mockResolvedValue(historyTracksMock)

      expect(
        await statsRigtchService.getTopArtists(
          {
            before: date,
            after: date,
            limit: 10,
            measurement: StatsMeasurement.PLAY_TIME,
          },
          userMock
        )
      ).toMatchObject(
        result.map(item => ({
          item: item,
          playtime: 1,
        }))
      )

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        date,
        date,
        relations
      )
      expect(getMostListenedItemsByDurationSpy).toHaveBeenCalled()
    })
  })

  describe('getTopAlbums', () => {
    const relations = {
      track: {
        album: {
          artists: true,
        },
      },
    }

    let result: Album[]

    beforeEach(() => {
      result = historyTracksMock
        .flatMap(({ track: { album } }) => album!)
        .slice(0, 10)
    })

    test('should get top albums with plays measurement', async () => {
      getMostFrequentItemsSpy.mockReturnValue(
        result.map(({ id }) => ({
          item: id,
          count: 1,
        }))
      )
      findByUserAndBetweenDatesSpy.mockResolvedValue(historyTracksMock)

      expect(
        await statsRigtchService.getTopAlbums(
          {
            before: date,
            after: date,
            limit: 10,
            measurement: StatsMeasurement.PLAYS,
          },
          userMock
        )
      ).toMatchObject(
        result.map(item => ({
          item: item,
          plays: 1,
        }))
      )

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        date,
        date,
        relations
      )
      expect(getMostFrequentItemsSpy).toHaveBeenCalled()
    })

    test('should get top albums with play time measurement', async () => {
      getMostListenedItemsByDurationSpy.mockReturnValue(
        result.map(({ id }) => ({
          id,
          totalDuration: 1,
        }))
      )
      findByUserAndBetweenDatesSpy.mockResolvedValue(historyTracksMock)

      expect(
        await statsRigtchService.getTopAlbums(
          {
            before: date,
            after: date,
            limit: 10,
            measurement: StatsMeasurement.PLAY_TIME,
          },
          userMock
        )
      ).toMatchObject(
        result.map(item => ({
          item: item,
          playtime: 1,
        }))
      )

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        date,
        date,
        relations
      )
      expect(getMostListenedItemsByDurationSpy).toHaveBeenCalled()
    })
  })

  describe('getTopGenres', () => {
    const relations = {
      track: {
        artists: true,
      },
    }

    let result: string[]

    beforeEach(() => {
      result = historyTracksMock
        .flatMap(({ track: { artists } }) => artists)
        .flatMap(({ genres }) => genres)
        .slice(0, 10)
    })

    test('should get top genres with plays measurement', async () => {
      getMostFrequentItemsSpy.mockReturnValue(
        result.map(item => ({
          item,
          count: 1,
        }))
      )
      findByUserAndBetweenDatesSpy.mockResolvedValue(historyTracksMock)

      expect(
        await statsRigtchService.getTopGenres(
          {
            before: date,
            after: date,
            limit: 10,
            measurement: StatsMeasurement.PLAYS,
          },
          userMock
        )
      ).toMatchObject(
        result.map(item => ({
          item,
          plays: 1,
        }))
      )

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        date,
        date,
        relations
      )
      expect(getMostFrequentItemsSpy).toHaveBeenCalled()
    })

    test('should get top genres with play time measurement', async () => {
      getMostListenedItemsByDurationSpy.mockReturnValue(
        result.map(item => ({
          id: item,
          totalDuration: 1,
        }))
      )
      findByUserAndBetweenDatesSpy.mockResolvedValue(historyTracksMock)

      expect(
        await statsRigtchService.getTopGenres(
          {
            before: date,
            after: date,
            limit: 10,
            measurement: StatsMeasurement.PLAY_TIME,
          },
          userMock
        )
      ).toMatchObject(
        result.map(item => ({
          item,
          playtime: 1,
        }))
      )

      expect(findByUserAndBetweenDatesSpy).toHaveBeenCalledWith(
        userMock.id,
        date,
        date,
        relations
      )
      expect(getMostListenedItemsByDurationSpy).toHaveBeenCalled()
    })
  })
})
