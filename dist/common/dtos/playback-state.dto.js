"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PlaybackState", {
    enumerable: true,
    get: function() {
        return PlaybackState;
    }
});
const _swagger = require("@nestjs/swagger");
const _ = require("./index");
const _spotify = require("../types/spotify");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let PlaybackState = class PlaybackState {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: _.Device
    }),
    _ts_metadata("design:type", typeof _.Device === "undefined" ? Object : _.Device)
], PlaybackState.prototype, "device", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: String
    }),
    _ts_metadata("design:type", typeof _spotify.RepeatedState === "undefined" ? Object : _spotify.RepeatedState)
], PlaybackState.prototype, "repeatState", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: String
    }),
    _ts_metadata("design:type", typeof _spotify.ShuffleState === "undefined" ? Object : _spotify.ShuffleState)
], PlaybackState.prototype, "shuffleState", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Boolean
    }),
    _ts_metadata("design:type", Boolean)
], PlaybackState.prototype, "isPlaying", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: _.Track
    }),
    _ts_metadata("design:type", typeof _.Track === "undefined" ? Object : _.Track)
], PlaybackState.prototype, "track", void 0);

//# sourceMappingURL=playback-state.dto.js.map