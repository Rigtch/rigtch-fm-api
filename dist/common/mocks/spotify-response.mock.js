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
    spotifyResponseMockFactory: function() {
        return spotifyResponseMockFactory;
    },
    spotifyResponseWithOffsetMockFactory: function() {
        return spotifyResponseWithOffsetMockFactory;
    },
    spotifyResponseWithCursorsMockFactory: function() {
        return spotifyResponseWithCursorsMockFactory;
    }
});
const spotifyResponseMockFactory = (items)=>({
        href: 'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=0&limit=20',
        limit: 20,
        next: 'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=20&limit=20',
        items
    });
const spotifyResponseWithOffsetMockFactory = (items)=>({
        ...spotifyResponseMockFactory(items),
        offset: 0
    });
const spotifyResponseWithCursorsMockFactory = (items)=>({
        ...spotifyResponseMockFactory(items),
        cursors: {
            after: '1693946946214',
            before: '1693946946214'
        }
    });

//# sourceMappingURL=spotify-response.mock.js.map