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
    adaptTrack: function() {
        return adaptTrack;
    },
    adaptTracks: function() {
        return adaptTracks;
    }
});
const adaptTrack = ({ id, name, album, artists, external_urls: { spotify: href }, duration_ms, progress_ms, played_at })=>({
        id,
        name,
        album: {
            name: album.name,
            images: album.images
        },
        artists: artists.map(({ name, id, href })=>({
                name,
                id,
                href
            })),
        href,
        duration: duration_ms,
        ...progress_ms && {
            progress: progress_ms
        },
        ...played_at && {
            playedAt: played_at
        }
    });
const adaptTracks = (tracks)=>tracks.map((track)=>adaptTrack(track));

//# sourceMappingURL=tracks.adapter.js.map