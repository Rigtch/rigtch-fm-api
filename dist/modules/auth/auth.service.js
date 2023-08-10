"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _axios = require("@nestjs/axios");
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _jwt = require("@nestjs/jwt");
const _rxjs = require("rxjs");
const _config1 = require("../../config");
const _utils = require("../../utils");
const _adapters = require("../../common/adapters");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let AuthService = class AuthService {
    login({ id, username }) {
        const payload = {
            name: username,
            sub: id
        };
        return this.jwtService.sign(payload);
    }
    token({ refreshToken, code }) {
        const url = `${this.configService.get(_config1.Environment.SPOTIFY_ACCOUNTS_URL)}/api/token`;
        const cliendId = this.configService.get(_config1.Environment.SPOTIFY_CLIENT_ID);
        const clientSecret = this.configService.get(_config1.Environment.SPOTIFY_CLIENT_SECRET);
        const bufferedCredentials = Buffer.from(`${cliendId}:${clientSecret}`).toString('base64');
        const parameters = new URLSearchParams();
        if (refreshToken) {
            parameters.append('refresh_token', refreshToken);
            parameters.append('grant_type', 'refresh_token');
        }
        if (code) {
            parameters.append('code', code);
            parameters.append('grant_type', 'authorization_code');
            parameters.append('redirect_uri', this.configService.get(_config1.Environment.SPOTIFY_CALLBACK_URL));
        }
        return this.httpService.post(url, parameters, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${bufferedCredentials}`
            }
        }).pipe((0, _rxjs.map)((response)=>response.data), (0, _rxjs.map)(_adapters.adaptSecretData), (0, _rxjs.catchError)(_utils.catchSpotifyError));
    }
    profile(accessToken) {
        return this.httpService.get('/me', (0, _utils.applyAuthorizationHeader)(accessToken)).pipe((0, _rxjs.map)((response)=>response.data), (0, _rxjs.map)(_adapters.adaptProfile), (0, _rxjs.catchError)(_utils.catchSpotifyError));
    }
    constructor(jwtService, httpService, configService){
        this.jwtService = jwtService;
        this.httpService = httpService;
        this.configService = configService;
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map