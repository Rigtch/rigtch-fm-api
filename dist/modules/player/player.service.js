"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PlayerService", {
    enumerable: true,
    get: function() {
        return PlayerService;
    }
});
const _axios = require("@nestjs/axios");
const _common = require("@nestjs/common");
const _rxjs = require("rxjs");
const _messages = require("./messages/index");
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
let PlayerService = class PlayerService {
    availableDevices(accessToken) {
        return this.httpService.get('/me/player/devices', (0, _utils.applyAuthorizationHeader)(accessToken)).pipe((0, _rxjs.map)((response)=>response.data.devices), (0, _rxjs.catchError)(_utils.catchSpotifyError), (0, _rxjs.tap)((devices)=>{
            if (devices.length <= 0) throw new _common.ForbiddenException(_messages.PlayerMessage.NO_AVAIBLE_DEVICES);
        }), (0, _rxjs.map)(_adapters.adaptDevices));
    }
    currentPlaybackState(accessToken) {
        return this.httpService.get('/me/player', (0, _utils.applyAuthorizationHeader)(accessToken)).pipe((0, _rxjs.map)((response)=>response.data), (0, _rxjs.catchError)(_utils.catchSpotifyError), (0, _rxjs.tap)((playbackState)=>{
            if (!playbackState.device) throw new _common.ForbiddenException(_messages.PlayerMessage.NO_PLAYING_DEVICE);
        }), (0, _rxjs.map)(_adapters.adaptPlaybackState));
    }
    pausePlayer(accessToken, afterTime = 0, deviceId) {
        const deviceIdQuery = `?device_id=${deviceId}`;
        return (0, _rxjs.timer)(afterTime).pipe((0, _rxjs.exhaustMap)(()=>{
            return this.httpService.put(`/me/player/pause${deviceId ? deviceIdQuery : ''}`, {}, (0, _utils.applyAuthorizationHeader)(accessToken)).pipe((0, _rxjs.map)(()=>({
                    success: true
                })), (0, _rxjs.catchError)((error)=>{
                if (error.response.data.error.status === 403) throw new _common.ForbiddenException(_messages.PlayerMessage.NO_PLAYING_DEVICE);
                return (0, _utils.catchSpotifyError)(error);
            }));
        }));
    }
    resumePlayer(accessToken, deviceId) {
        const deviceIdQuery = `?device_id=${deviceId}`;
        return this.httpService.put(`/me/player/play${deviceId ? deviceIdQuery : ''}`, {}, (0, _utils.applyAuthorizationHeader)(accessToken)).pipe((0, _rxjs.map)(()=>({
                success: true
            })), (0, _rxjs.catchError)((error)=>{
            if (error.response.data.error.status === 403) throw new _common.ForbiddenException(_messages.PlayerMessage.DEVICE_ALREADY_PLAYING);
            return (0, _utils.catchSpotifyError)(error);
        }));
    }
    constructor(httpService){
        this.httpService = httpService;
    }
};
PlayerService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService
    ])
], PlayerService);

//# sourceMappingURL=player.service.js.map