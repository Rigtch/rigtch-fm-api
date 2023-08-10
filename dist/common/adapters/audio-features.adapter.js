"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "adaptAudioFeatures", {
    enumerable: true,
    get: function() {
        return adaptAudioFeatures;
    }
});
const adaptAudioFeatures = ({ id, track_href, danceability, acousticness, instrumentalness, speechiness, liveness, loudness, energy, tempo, mode, key, valence })=>({
        id,
        trackHref: track_href,
        danceability,
        acousticness,
        instrumentalness,
        speechiness,
        liveness,
        loudness,
        energy,
        tempo,
        mode,
        key,
        valence
    });

//# sourceMappingURL=audio-features.adapter.js.map