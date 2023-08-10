"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _common = require("@nestjs/common");
const _catchspotifyerror = require("./catch-spotify-error");
(0, _vitest.describe)('catchSpotifyError', ()=>{
    (0, _vitest.test)('should throw UnauthorizedException', ()=>{
        (0, _vitest.expect)(()=>(0, _catchspotifyerror.catchSpotifyError)({
                response: {
                    data: {
                        error: {
                            message: 'Unauthorized'
                        }
                    },
                    status: 401
                }
            })).toThrowError(_common.UnauthorizedException);
    });
    (0, _vitest.test)('should throw UnauthorizedException as invalid grant', ()=>{
        (0, _vitest.expect)(()=>(0, _catchspotifyerror.catchSpotifyError)({
                response: {
                    data: {
                        error: 'invalid_grant'
                    },
                    status: 401
                }
            })).toThrowError(_common.UnauthorizedException);
    });
    (0, _vitest.test)('should throw InternalServerErrorException', ()=>{
        (0, _vitest.expect)(()=>(0, _catchspotifyerror.catchSpotifyError)({
                response: {
                    data: {
                        error: {
                            message: 'Internal Server Error'
                        }
                    },
                    status: 500
                }
            })).toThrowError(_common.InternalServerErrorException);
    });
});

//# sourceMappingURL=catch-spotify-error.spec.js.map