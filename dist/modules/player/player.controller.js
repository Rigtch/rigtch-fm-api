"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PlayerController", {
    enumerable: true,
    get: function() {
        return PlayerController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _playerservice = require("./player.service");
const _dtos = require("../../common/dtos");
const _auth = require("../auth");
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
let PlayerController = class PlayerController {
    availableDevices(accessToken) {
        return this.playerService.availableDevices(accessToken);
    }
    currentPlaybackState(accessToken) {
        return this.playerService.currentPlaybackState(accessToken);
    }
    pausePlayer(accessToken, afterTime, deviceId) {
        return this.playerService.pausePlayer(accessToken, afterTime, deviceId);
    }
    resumePlayer(accessToken, deviceId) {
        return this.playerService.resumePlayer(accessToken, deviceId);
    }
    constructor(playerService){
        this.playerService = playerService;
    }
};
_ts_decorate([
    (0, _common.Get)('/devices'),
    (0, _swagger.ApiOkResponse)({
        type: _dtos.Device,
        description: 'Available devices has been succesfully found'
    }),
    _ts_param(0, (0, _auth.Token)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ])
], PlayerController.prototype, "availableDevices", null);
_ts_decorate([
    (0, _common.Get)('/state'),
    (0, _swagger.ApiOkResponse)({
        type: _dtos.PlaybackState,
        description: 'Current playback state has been succesfully found'
    }),
    _ts_param(0, (0, _auth.Token)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ])
], PlayerController.prototype, "currentPlaybackState", null);
_ts_decorate([
    (0, _common.Put)('/pause'),
    (0, _swagger.ApiQuery)({
        name: 'afterTime',
        type: Number,
        required: false
    }),
    (0, _swagger.ApiQuery)({
        name: 'deviceId',
        type: String,
        required: false
    }),
    (0, _swagger.ApiForbiddenResponse)({
        description: 'No device is currently playing'
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'Player state has been succesfully paused',
        type: _dtos.Success
    }),
    _ts_param(0, (0, _auth.Token)()),
    _ts_param(1, (0, _common.Query)('afterTime')),
    _ts_param(2, (0, _common.Query)('deviceId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        Number,
        String
    ])
], PlayerController.prototype, "pausePlayer", null);
_ts_decorate([
    (0, _common.Put)('/resume'),
    (0, _swagger.ApiQuery)({
        name: 'deviceId',
        type: String,
        required: false
    }),
    (0, _swagger.ApiForbiddenResponse)({
        description: 'Device is already playing'
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'Player state has been succesfully resumed',
        type: _dtos.Success
    }),
    _ts_param(0, (0, _auth.Token)()),
    _ts_param(1, (0, _common.Query)('deviceId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ])
], PlayerController.prototype, "resumePlayer", null);
PlayerController = _ts_decorate([
    (0, _common.Controller)('player'),
    (0, _swagger.ApiTags)('player'),
    (0, _auth.ApiAuth)(_auth.AuthenticationType.ACCESS_TOKEN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _playerservice.PlayerService === "undefined" ? Object : _playerservice.PlayerService
    ])
], PlayerController);

//# sourceMappingURL=player.controller.js.map