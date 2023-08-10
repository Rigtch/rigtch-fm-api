"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ImageDto", {
    enumerable: true,
    get: function() {
        return ImageDto;
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
let ImageDto = class ImageDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], ImageDto.prototype, "height", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], ImageDto.prototype, "width", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], ImageDto.prototype, "url", void 0);

//# sourceMappingURL=image.dto.js.map