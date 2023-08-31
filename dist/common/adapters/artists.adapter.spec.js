"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _mocks = require("../mocks/index");
const _artistsadapter = require("./artists.adapter");
(0, _vitest.describe)('adaptArtists', ()=>{
    (0, _vitest.test)('should adapt artist', ()=>{
        (0, _vitest.expect)((0, _artistsadapter.adaptArtist)(_mocks.spotifyArtistMock)).toEqual(_mocks.formattedArtistMock);
    });
    (0, _vitest.test)('should adapt artists', ()=>{
        (0, _vitest.expect)((0, _artistsadapter.adaptArtists)(_mocks.spotifyArtistsMock)).toEqual(_mocks.formattedArtistsMock);
    });
    (0, _vitest.test)('should adapt paginated artists', ()=>{
        (0, _vitest.expect)((0, _artistsadapter.adaptPaginatedArtists)({
            ...(0, _mocks.spotifyResponseMockFactory)(_mocks.spotifyArtistsMock),
            offset: 0
        })).toEqual((0, _mocks.spotifyResponseMockFactory)(_mocks.formattedArtistsMock));
    });
});

//# sourceMappingURL=artists.adapter.spec.js.map