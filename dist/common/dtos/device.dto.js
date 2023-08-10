"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Device", {
    enumerable: true,
    get: function() {
        return Device;
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
let Device = class Device {
};
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], Device.prototype, "id", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], Device.prototype, "name", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)(),
    _ts_metadata("design:type", String)
], Device.prototype, "type", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Boolean
    }),
    _ts_metadata("design:type", Boolean)
], Device.prototype, "isActive", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Boolean
    }),
    _ts_metadata("design:type", Boolean)
], Device.prototype, "isPrivateSession", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Boolean
    }),
    _ts_metadata("design:type", Boolean)
], Device.prototype, "isRestricted", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        type: Number
    }),
    _ts_metadata("design:type", Number)
], Device.prototype, "volumePercent", void 0);

//# sourceMappingURL=device.dto.js.map