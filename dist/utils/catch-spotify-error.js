"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "catchSpotifyError", {
    enumerable: true,
    get: function() {
        return catchSpotifyError;
    }
});
const _common = require("@nestjs/common");
const catchSpotifyError = (error)=>{
    const { response: { data, status } } = error;
    if (data?.error === 'invalid_grant') throw new _common.UnauthorizedException('Invalid token');
    if (status === 401) throw new _common.UnauthorizedException(data?.error?.message);
    if (status === 403 && data === 'User not registered in the Developer Dashboard') throw new _common.ForbiddenException('User not registered in the Developer Dashboard');
    throw new _common.InternalServerErrorException('Something went wrong with fetching data from spotify API', data?.error);
};

//# sourceMappingURL=catch-spotify-error.js.map