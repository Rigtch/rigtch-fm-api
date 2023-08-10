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
    Artist: function() {
        return Artist;
    },
    TrackArtist: function() {
        return TrackArtist;
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
let Artist = class Artist {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], Artist.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], Artist.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: [
            String
        ]
    }),
    _ts_metadata("design:type", Array)
], Artist.prototype, "genres", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], Artist.prototype, "href", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: [
            _.ImageDto
        ]
    }),
    _ts_metadata("design:type", Array)
], Artist.prototype, "images", void 0);
let TrackArtist = class TrackArtist {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], TrackArtist.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], TrackArtist.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], TrackArtist.prototype, "href", void 0);

//# sourceMappingURL=artist.dto.js.map