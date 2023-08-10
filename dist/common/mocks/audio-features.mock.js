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
    spotifyAudioFeaturesMock: function() {
        return spotifyAudioFeaturesMock;
    },
    formattedAudioFeaturesMock: function() {
        return formattedAudioFeaturesMock;
    },
    analysisMock: function() {
        return analysisMock;
    }
});
const spotifyAudioFeaturesMock = {
    acousticness: 0.016,
    analysis_url: 'https://api.spotify.com/v1/audio-analysis/2JIRtFAIUkd86PQD12Hm7r',
    danceability: 0.267,
    duration_ms: 369_760,
    energy: 1,
    id: '2JIRtFAIUkd86PQD12Hm7r',
    instrumentalness: 0.447,
    key: 4,
    liveness: 0.45,
    loudness: -4.92,
    mode: 0,
    speechiness: 0.135,
    tempo: 138.616,
    time_signature: 4,
    track_href: 'https://api.spotify.com/v1/tracks/2JIRtFAIUkd86PQD12Hm7r',
    type: 'audio_features',
    uri: 'spotify:track:2JIRtFAIUkd86PQD12Hm7r',
    valence: 0.0215
};
const formattedAudioFeaturesMock = {
    acousticness: 0.016,
    danceability: 0.267,
    energy: 1,
    id: '2JIRtFAIUkd86PQD12Hm7r',
    instrumentalness: 0.447,
    key: 4,
    liveness: 0.45,
    loudness: -4.92,
    mode: 0,
    speechiness: 0.135,
    tempo: 138.616,
    trackHref: 'https://api.spotify.com/v1/tracks/2JIRtFAIUkd86PQD12Hm7r',
    valence: 0.0215
};
const analysisMock = {
    acousticness: 0.016,
    danceability: 0.267,
    energy: 1,
    instrumentalness: 0.447,
    liveness: 0.45,
    loudness: -4.92,
    speechiness: 0.135,
    tempo: 138.616,
    valence: 0.0215,
    mode: 0,
    key: 4
};

//# sourceMappingURL=audio-features.mock.js.map