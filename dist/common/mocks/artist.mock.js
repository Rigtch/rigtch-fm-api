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
    spotifyArtistMock: function() {
        return spotifyArtistMock;
    },
    spotifyArtistsMock: function() {
        return spotifyArtistsMock;
    },
    formattedArtistMock: function() {
        return formattedArtistMock;
    },
    formattedArtistsMock: function() {
        return formattedArtistsMock;
    }
});
const spotifyArtistMock = {
    external_urls: {
        spotify: 'https://open.spotify.com/artist/7kWnE981vITXDnAD2cZmCV'
    },
    followers: {
        href: undefined,
        total: 265_520
    },
    genres: [
        "black 'n' roll",
        'black metal',
        'blackened crust',
        'metal',
        'norwegian black metal',
        'norwegian death metal',
        'norwegian metal'
    ],
    href: 'https://api.spotify.com/v1/artists/7kWnE981vITXDnAD2cZmCV',
    id: '7kWnE981vITXDnAD2cZmCV',
    images: [
        {
            height: 640,
            url: 'https://i.scdn.co/image/ab6761610000e5eb0f08b008da9d91574819c92e',
            width: 640
        },
        {
            height: 320,
            url: 'https://i.scdn.co/image/ab676161000051740f08b008da9d91574819c92e',
            width: 320
        },
        {
            height: 160,
            url: 'https://i.scdn.co/image/ab6761610000f1780f08b008da9d91574819c92e',
            width: 160
        }
    ],
    name: 'Darkthrone',
    popularity: 43,
    type: 'artist',
    uri: 'spotify:artist:7kWnE981vITXDnAD2cZmCV'
};
const spotifyArtistsMock = Array.from({
    length: 5
}).map(()=>spotifyArtistMock);
const formattedArtistMock = {
    id: '7kWnE981vITXDnAD2cZmCV',
    name: 'Darkthrone',
    genres: [
        "black 'n' roll",
        'black metal',
        'blackened crust',
        'metal',
        'norwegian black metal',
        'norwegian death metal',
        'norwegian metal'
    ],
    href: 'https://open.spotify.com/artist/7kWnE981vITXDnAD2cZmCV',
    images: [
        {
            height: 640,
            url: 'https://i.scdn.co/image/ab6761610000e5eb0f08b008da9d91574819c92e',
            width: 640
        },
        {
            height: 320,
            url: 'https://i.scdn.co/image/ab676161000051740f08b008da9d91574819c92e',
            width: 320
        },
        {
            height: 160,
            url: 'https://i.scdn.co/image/ab6761610000f1780f08b008da9d91574819c92e',
            width: 160
        }
    ]
};
const formattedArtistsMock = Array.from({
    length: 5
}).map(()=>formattedArtistMock);

//# sourceMappingURL=artist.mock.js.map