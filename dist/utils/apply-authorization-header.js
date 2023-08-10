"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "applyAuthorizationHeader", {
    enumerable: true,
    get: function() {
        return applyAuthorizationHeader;
    }
});
const applyAuthorizationHeader = (accessToken)=>({
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

//# sourceMappingURL=apply-authorization-header.js.map