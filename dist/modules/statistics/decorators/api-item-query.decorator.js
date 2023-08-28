"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApiItemQuery", {
    enumerable: true,
    get: function() {
        return ApiItemQuery;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _enums = require("../enums/index");
const ApiItemQuery = (isTopItem = false)=>(0, _common.applyDecorators)((0, _swagger.ApiQuery)({
        name: 'limit',
        type: Number,
        required: false
    }), (0, _swagger.ApiQuery)({
        name: 'timeRange',
        enum: _enums.TimeRange,
        required: false
    }), isTopItem ? (0, _swagger.ApiQuery)({
        name: 'offset',
        type: Number,
        required: false
    }) : ()=>{});

//# sourceMappingURL=api-item-query.decorator.js.map