"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _mocks = require("../mocks/index");
const _playbackstateadapter = require("./playback-state.adapter");
(0, _vitest.describe)('adaptPlaybackState', ()=>{
    (0, _vitest.test)('should adapt playback state', ()=>{
        (0, _vitest.expect)((0, _playbackstateadapter.adaptPlaybackState)(_mocks.spotifyPlaybackStateMock)).toEqual(_mocks.formattedPlaybackStateMock);
    });
});

//# sourceMappingURL=playback-state.adapter.spec.js.map