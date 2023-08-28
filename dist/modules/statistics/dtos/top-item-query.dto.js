"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TopItemQuery", {
    enumerable: true,
    get: function() {
        return TopItemQuery;
    }
});
const _classvalidator = require("class-validator");
const _enums = require("../enums/index");
const _itemquerydto = require("./item-query.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TopItemQuery = class TopItemQuery extends _itemquerydto.ItemQuery {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_enums.TimeRange),
    _ts_metadata("design:type", typeof _enums.TimeRange === "undefined" ? Object : _enums.TimeRange)
], TopItemQuery.prototype, "timeRange", void 0);

//# sourceMappingURL=top-item-query.dto.js.map