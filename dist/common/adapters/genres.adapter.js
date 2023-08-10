"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "adaptGenres", {
    enumerable: true,
    get: function() {
        return adaptGenres;
    }
});
const _utils = require("../../utils");
const adaptGenres = (artists, limit)=>({
        genres: (0, _utils.getMostFrequentItems)(artists.flatMap(({ genres })=>genres), limit)
    });

//# sourceMappingURL=genres.adapter.js.map