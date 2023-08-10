"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Track", {
    enumerable: true,
    get: function() {
        return Track;
    }
});
const _swagger = require("@nestjs/swagger");
const _ = require("./index");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Track = class Track {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], Track.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], Track.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], Track.prototype, "href", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: [
            _.TrackArtist
        ]
    }),
    _ts_metadata("design:type", Array)
], Track.prototype, "artists", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: _.Album
    }),
    _ts_metadata("design:type", typeof _.Album === "undefined" ? Object : _.Album)
], Track.prototype, "album", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Track.prototype, "duration", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number,
        required: false
    }),
    _ts_metadata("design:type", Number)
], Track.prototype, "progress", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    _ts_metadata("design:type", String)
], Track.prototype, "playedAt", void 0);

//# sourceMappingURL=track.dto.js.map