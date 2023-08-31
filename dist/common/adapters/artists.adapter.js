"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    adaptArtist: function() {
        return adaptArtist;
    },
    adaptArtists: function() {
        return adaptArtists;
    },
    adaptPaginatedArtists: function() {
        return adaptPaginatedArtists;
    }
});
const _paginatedadapter = require("./paginated.adapter");
const adaptArtist = ({ id, name, genres, external_urls: { spotify: href }, images })=>({
        id,
        name,
        genres,
        href,
        images
    });
const adaptArtists = (artists)=>artists.map((artist)=>adaptArtist(artist));
const adaptPaginatedArtists = (data)=>(0, _paginatedadapter.adaptPaginated)(data, adaptArtists);

//# sourceMappingURL=artists.adapter.js.map