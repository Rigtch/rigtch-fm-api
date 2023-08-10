"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "adaptSecretData", {
    enumerable: true,
    get: function() {
        return adaptSecretData;
    }
});
const adaptSecretData = ({ access_token, refresh_token, expires_in })=>({
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in
    });

//# sourceMappingURL=secret-data.adapter.js.map