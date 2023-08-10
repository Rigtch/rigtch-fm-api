"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _mocks = require("../mocks/index");
const _genresadapter = require("./genres.adapter");
(0, _vitest.describe)('adaptGenres', ()=>{
    (0, _vitest.test)('should adapt genres', ()=>{
        (0, _vitest.expect)((0, _genresadapter.adaptGenres)(_mocks.spotifyArtistsMock, 3)).toEqual(_mocks.topGenresMock);
    });
});

//# sourceMappingURL=genres.adapter.spec.js.map