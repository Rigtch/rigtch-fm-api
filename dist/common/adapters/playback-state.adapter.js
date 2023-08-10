"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "adaptPlaybackState", {
    enumerable: true,
    get: function() {
        return adaptPlaybackState;
    }
});
const _devicesadapter = require("./devices.adapter");
const _tracksadapter = require("./tracks.adapter");
const adaptPlaybackState = ({ device, repeat_state, shuffle_state, is_playing, item })=>{
    const [formattedDevice] = (0, _devicesadapter.adaptDevices)([
        device
    ]);
    const [formattedTrack] = (0, _tracksadapter.adaptTracks)([
        item
    ]);
    return {
        device: formattedDevice,
        repeatState: repeat_state,
        shuffleState: shuffle_state,
        isPlaying: is_playing,
        track: formattedTrack
    };
};

//# sourceMappingURL=playback-state.adapter.js.map