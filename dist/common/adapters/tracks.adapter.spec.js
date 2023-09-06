"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _mocks = require("../mocks/index");
const _tracksadapter = require("./tracks.adapter");
(0, _vitest.describe)('adaptTracks', ()=>{
    (0, _vitest.test)('should adapt tracks', ()=>{
        (0, _vitest.expect)((0, _tracksadapter.adaptTracks)(_mocks.spotifyTracksMock)).toEqual(_mocks.formattedTracksMock);
    });
    (0, _vitest.test)('should adapt tracks without duration', ()=>{
        (0, _vitest.expect)((0, _tracksadapter.adaptTracks)(_mocks.spotifyTracksMock.map(({ progress_ms, ...rest })=>rest))).toEqual(_mocks.formattedTracksMock.map(({ progress, ...rest })=>rest));
    });
    (0, _vitest.test)('should adapt tracks without playedAt field', ()=>{
        (0, _vitest.expect)((0, _tracksadapter.adaptTracks)(_mocks.spotifyTracksMock.map(({ played_at, ...rest })=>rest))).toEqual(_mocks.formattedTracksMock.map(({ playedAt, ...rest })=>rest));
    });
    (0, _vitest.test)('should adapt paginated tracks', ()=>{
        (0, _vitest.expect)((0, _tracksadapter.adaptPaginatedTracks)((0, _mocks.spotifyResponseWithOffsetMockFactory)(_mocks.spotifyTracksMock))).toEqual((0, _mocks.spotifyResponseWithOffsetMockFactory)(_mocks.formattedTracksMock));
    });
    (0, _vitest.test)('should adapt last tracks', ()=>{
        (0, _vitest.expect)((0, _tracksadapter.adaptLastTracks)((0, _mocks.spotifyResponseWithCursorsMockFactory)(_mocks.spotifyTracksMock))).toEqual((0, _mocks.spotifyResponseWithCursorsMockFactory)(_mocks.formattedTracksMock));
    });
});

//# sourceMappingURL=tracks.adapter.spec.js.map