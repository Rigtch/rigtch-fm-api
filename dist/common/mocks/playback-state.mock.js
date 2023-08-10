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
    spotifyPlaybackStateMock: function() {
        return spotifyPlaybackStateMock;
    },
    formattedPlaybackStateMock: function() {
        return formattedPlaybackStateMock;
    }
});
const _spotify = require("../types/spotify/index");
const _ = require("./index");
const spotifyPlaybackStateMock = {
    device: _.spotifyDeviceMock,
    repeat_state: _spotify.RepeatedState.OFF,
    shuffle_state: _spotify.ShuffleState.OFF,
    is_playing: true,
    item: _.spotifyTrackMock
};
const formattedPlaybackStateMock = {
    device: _.formattedDeviceMock,
    repeatState: _spotify.RepeatedState.OFF,
    shuffleState: _spotify.ShuffleState.OFF,
    isPlaying: true,
    track: _.formattedTrackMock
};

//# sourceMappingURL=playback-state.mock.js.map