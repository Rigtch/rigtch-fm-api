"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _mocks = require("../mocks/index");
const _audiofeaturesadapter = require("./audio-features.adapter");
(0, _vitest.describe)('adaptAudioFeatures', ()=>{
    (0, _vitest.test)('should adapt audio features', ()=>{
        (0, _vitest.expect)((0, _audiofeaturesadapter.adaptAudioFeatures)(_mocks.spotifyAudioFeaturesMock)).toEqual(_mocks.formattedAudioFeaturesMock);
    });
});

//# sourceMappingURL=audio-features.adapter.spec.js.map