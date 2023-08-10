"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _secretdataadapter = require("./secret-data.adapter");
(0, _vitest.describe)('adaptSecretData', ()=>{
    (0, _vitest.test)('should adapt secret data', ()=>{
        const spotifyTokenMock = {
            access_token: 'accessToken',
            token_type: 'tokenType',
            scope: 'scope',
            expires_in: 3600,
            refresh_token: 'refreshToken'
        };
        const secretDataMock = {
            accessToken: 'accessToken',
            expiresIn: 3600,
            refreshToken: 'refreshToken'
        };
        (0, _vitest.expect)((0, _secretdataadapter.adaptSecretData)(spotifyTokenMock)).toEqual(secretDataMock);
    });
});

//# sourceMappingURL=secret-data.adapter.spec.js.map