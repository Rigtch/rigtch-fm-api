"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApiAuth", {
    enumerable: true,
    get: function() {
        return ApiAuth;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const ApiAuth = (authenticationType)=>(0, _common.applyDecorators)((0, _swagger.ApiUnauthorizedResponse)({
        description: 'The access token expired'
    }), (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Invalid access token'
    }), (0, _swagger.ApiUnauthorizedResponse)({
        description: 'No value was provided for Authentication'
    }), (0, _swagger.ApiBearerAuth)(authenticationType));

//# sourceMappingURL=api-auth.decorator.js.map