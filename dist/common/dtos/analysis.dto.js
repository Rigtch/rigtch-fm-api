"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Analysis", {
    enumerable: true,
    get: function() {
        return Analysis;
    }
});
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let Analysis = class Analysis {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Analysis.prototype, "danceability", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Analysis.prototype, "acousticness", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Analysis.prototype, "instrumentalness", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Analysis.prototype, "speechiness", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Analysis.prototype, "liveness", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Analysis.prototype, "loudness", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Analysis.prototype, "energy", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Analysis.prototype, "tempo", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Analysis.prototype, "mode", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Analysis.prototype, "key", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Analysis.prototype, "valence", void 0);

//# sourceMappingURL=analysis.dto.js.map