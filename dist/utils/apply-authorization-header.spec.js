"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _applyauthorizationheader = require("./apply-authorization-header");
(0, _vitest.describe)('applyAuthorizationHeader', ()=>{
    (0, _vitest.test)('should return valid object', ()=>{
        const { headers: { Authorization } } = (0, _applyauthorizationheader.applyAuthorizationHeader)('token');
        (0, _vitest.expect)(Authorization).toEqual('Bearer token');
    });
});

//# sourceMappingURL=apply-authorization-header.spec.js.map