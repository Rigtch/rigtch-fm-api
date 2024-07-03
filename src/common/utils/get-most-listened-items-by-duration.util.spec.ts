import { mock, mockDeep } from 'vitest-mock-extended'

import { getMostListenedItemsByDuration } from './get-most-listened-items-by-duration.util'

import { Track } from '@modules/items/tracks'

describe('getMostListenedItemsByDuration', () => {
  const mostListenedTrackId = '1'
  const mostListenedTrack = mock<Track>({
    id: mostListenedTrackId,
    duration: 500,
  })

  test('should get most listened track by duration', () => {
    const tracksMock = [
      mostListenedTrack,
      mockDeep<Track>({
        id: '2',
        duration: 200,
      }),
      mockDeep<Track>({
        id: '3',
        duration: 300,
      }),
    ]

    expect(getMostListenedItemsByDuration(tracksMock, 1)).toMatchObject([
      {
        id: mostListenedTrackId,
        totalDuration: 500,
      },
    ])
  })

  test('should get 3 most listened track by duration', () => {
    const secondMostListenedTrackId = '2'
    const thirdMostListenedTrackId = '3'

    const tracksMock = [
      mostListenedTrack,
      mockDeep<Track>({
        id: secondMostListenedTrackId,
        duration: 400,
      }),
      mockDeep<Track>({
        id: secondMostListenedTrackId,
        duration: 400,
      }),
      mockDeep<Track>({
        id: thirdMostListenedTrackId,
        duration: 600,
      }),
      mockDeep<Track>({
        id: '4',
        duration: 200,
      }),
      mostListenedTrack,
    ]

    expect(getMostListenedItemsByDuration(tracksMock, 3)).toMatchObject([
      {
        id: mostListenedTrackId,
        totalDuration: 1000,
      },
      {
        id: secondMostListenedTrackId,
        totalDuration: 800,
      },
      {
        id: thirdMostListenedTrackId,
        totalDuration: 600,
      },
    ])
  })
})
