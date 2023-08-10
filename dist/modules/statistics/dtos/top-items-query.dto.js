"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TopItemsQuery", {
    enumerable: true,
    get: function() {
        return TopItemsQuery;
    }
});
const _classvalidator = require("class-validator");
const _enums = require("../enums/index");
const _limitquerydto = require("./limit-query.dto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let TopItemsQuery = class TopItemsQuery extends _limitquerydto.LimitQuery {
};
_ts_decorate([
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_enums.TimeRange),
    _ts_metadata("design:type", typeof _enums.TimeRange === "undefined" ? Object : _enums.TimeRange)
], TopItemsQuery.prototype, "timeRange", void 0);

//# sourceMappingURL=top-items-query.dto.js.map