"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _mocks = require("../mocks/index");
const _artistsadapter = require("./artists.adapter");
const _paginatedadapter = require("./paginated.adapter");
(0, _vitest.describe)('adaptPaginated', ()=>{
    const spotifyArtistsResponseMock = {
        ...(0, _mocks.spotifyResponseMockFactory)(_mocks.spotifyArtistsMock),
        offset: 0
    };
    const formattedArtistsResponseMock = {
        ...(0, _mocks.spotifyResponseMockFactory)(_mocks.formattedArtistsMock),
        offset: 0
    };
    (0, _vitest.test)('should adapt paginated data', ()=>{
        (0, _vitest.expect)((0, _paginatedadapter.adaptPaginated)(spotifyArtistsResponseMock, _artistsadapter.adaptArtists)).toEqual(formattedArtistsResponseMock);
    });
});

//# sourceMappingURL=paginated.adapter.spec.js.map