"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProfileDto", {
    enumerable: true,
    get: function() {
        return ProfileDto;
    }
});
const _swagger = require("@nestjs/swagger");
const _dtos = require("../../../common/dtos");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ProfileDto = class ProfileDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], ProfileDto.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], ProfileDto.prototype, "displayName", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: [
            _dtos.ImageDto
        ]
    }),
    _ts_metadata("design:type", Array)
], ProfileDto.prototype, "images", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], ProfileDto.prototype, "followers", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    _ts_metadata("design:type", String)
], ProfileDto.prototype, "country", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        required: false
    }),
    _ts_metadata("design:type", String)
], ProfileDto.prototype, "email", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], ProfileDto.prototype, "href", void 0);

//# sourceMappingURL=profile.dto.js.map