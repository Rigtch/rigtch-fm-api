"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _rxjs = require("rxjs");
const _swagger = require("@nestjs/swagger");
const _authservice = require("./auth.service");
const _config1 = require("./config/index");
const _decorators = require("./decorators/index");
const _dtos = require("./dtos/index");
const _config2 = require("../../config");
const _enums = require("./enums");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const { SPOTIFY_CALLBACK_URL, SPOTIFY_CLIENT_ID, SPOTIFY_ACCOUNTS_URL, CLIENT_CALLBACK_URL } = _config2.Environment;
let AuthController = class AuthController {
    login() {
        return {
            url: `${this.configService.get(SPOTIFY_ACCOUNTS_URL)}/authorize?${new URLSearchParams({
                client_id: this.configService.get(SPOTIFY_CLIENT_ID),
                response_type: 'code',
                redirect_uri: this.configService.get(SPOTIFY_CALLBACK_URL),
                scope: _config1.spotifyAuthorizationScopes.join(' ')
            })}`,
            statusCode: _common.HttpStatus.PERMANENT_REDIRECT
        };
    }
    async callback(code) {
        const { accessToken, refreshToken } = await (0, _rxjs.firstValueFrom)(this.authService.token({
            code
        }));
        return {
            url: `${this.configService.get(CLIENT_CALLBACK_URL)}/api/authorize?${new URLSearchParams({
                accessToken,
                refreshToken
            })}`,
            statusCode: _common.HttpStatus.PERMANENT_REDIRECT
        };
    }
    refresh(refreshToken) {
        return this.authService.token({
            refreshToken
        });
    }
    profile(accessToken) {
        return this.authService.profile(accessToken);
    }
    constructor(authService, configService){
        this.authService = authService;
        this.configService = configService;
    }
};
_ts_decorate([
    (0, _common.Get)('login'),
    (0, _swagger.ApiExcludeEndpoint)(),
    (0, _common.Redirect)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], AuthController.prototype, "login", null);
_ts_decorate([
    (0, _common.Get)('callback'),
    (0, _swagger.ApiExcludeEndpoint)(),
    (0, _common.Redirect)(),
    _ts_param(0, (0, _common.Query)('code')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ])
], AuthController.prototype, "callback", null);
_ts_decorate([
    (0, _common.Get)('refresh'),
    (0, _decorators.ApiAuth)(_enums.AuthenticationType.REFRESH_TOKEN),
    (0, _swagger.ApiOkResponse)({
        description: 'Access token has been succesfully refreshed',
        type: _dtos.SecretData
    }),
    _ts_param(0, (0, _decorators.Token)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ])
], AuthController.prototype, "refresh", null);
_ts_decorate([
    (0, _common.Get)('profile'),
    (0, _decorators.ApiAuth)(_enums.AuthenticationType.ACCESS_TOKEN),
    (0, _swagger.ApiOkResponse)({
        description: "User's profile has been succesfully found",
        type: _dtos.ProfileDto
    }),
    _ts_param(0, (0, _decorators.Token)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ])
], AuthController.prototype, "profile", null);
AuthController = _ts_decorate([
    (0, _common.Controller)('auth'),
    (0, _swagger.ApiTags)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService,
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map