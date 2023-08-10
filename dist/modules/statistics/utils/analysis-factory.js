"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "analysisFactory", {
    enumerable: true,
    get: function() {
        return analysisFactory;
    }
});
const _audiofeaturesreducer = require("./audio-features-reducer");
const analysisFactory = (audioFeatures)=>({
        danceability: audioFeatures.map(({ danceability })=>danceability).reduce(_audiofeaturesreducer.audioFeaturesReducer) / audioFeatures.length,
        acousticness: audioFeatures.map(({ acousticness })=>acousticness).reduce(_audiofeaturesreducer.audioFeaturesReducer) / audioFeatures.length,
        instrumentalness: audioFeatures.map(({ instrumentalness })=>instrumentalness).reduce(_audiofeaturesreducer.audioFeaturesReducer, 0) / audioFeatures.length,
        speechiness: audioFeatures.map(({ speechiness })=>speechiness).reduce(_audiofeaturesreducer.audioFeaturesReducer) / audioFeatures.length,
        liveness: audioFeatures.map(({ liveness })=>liveness).reduce(_audiofeaturesreducer.audioFeaturesReducer) / audioFeatures.length,
        loudness: audioFeatures.map(({ loudness })=>loudness).reduce(_audiofeaturesreducer.audioFeaturesReducer) / audioFeatures.length,
        energy: audioFeatures.map(({ energy })=>energy).reduce(_audiofeaturesreducer.audioFeaturesReducer) / audioFeatures.length,
        tempo: audioFeatures.map(({ tempo })=>tempo).reduce(_audiofeaturesreducer.audioFeaturesReducer) / audioFeatures.length,
        mode: audioFeatures.map(({ mode })=>mode).reduce(_audiofeaturesreducer.audioFeaturesReducer) / audioFeatures.length,
        key: audioFeatures.map(({ key })=>key).reduce(_audiofeaturesreducer.audioFeaturesReducer) / audioFeatures.length,
        valence: audioFeatures.map(({ valence })=>valence).reduce(_audiofeaturesreducer.audioFeaturesReducer) / audioFeatures.length
    });

//# sourceMappingURL=analysis-factory.js.map