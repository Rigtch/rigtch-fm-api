"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "spotifyResponseMockFactory", {
    enumerable: true,
    get: function() {
        return spotifyResponseMockFactory;
    }
});
const spotifyResponseMockFactory = (items)=>({
        href: 'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=0&limit=20',
        limit: 20,
        next: 'https://api.spotify.com/v1/search?query=metallica&type=artist&offset=20&limit=20',
        items
    });

//# sourceMappingURL=spotify-response.mock.js.map