"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StatisticsService", {
    enumerable: true,
    get: function() {
        return StatisticsService;
    }
});
const _axios = require("@nestjs/axios");
const _common = require("@nestjs/common");
const _rxjs = require("rxjs");
const _utils = require("./utils/index");
const _enums = require("./enums/index");
const _utils1 = require("../../utils");
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
let StatisticsService = class StatisticsService {
    lastTracks(accessToken, limit = 20) {
        return this.httpService.get(`/me/player/recently-played?limit=${limit}`, (0, _utils1.applyAuthorizationHeader)(accessToken)).pipe((0, _rxjs.map)((response)=>response.data.items), (0, _rxjs.map)((items)=>items.map(({ track, played_at })=>({
                    ...track,
                    played_at
                }))), (0, _rxjs.map)(_adapters.adaptTracks), (0, _rxjs.catchError)(_utils1.catchSpotifyError));
    }
    topGenres(accessToken, limit = 10, timeRange = _enums.TimeRange.LONG_TERM) {
        return this.httpService.get(`/me/top/artists?limit=${50}&time_range=${timeRange}`, (0, _utils1.applyAuthorizationHeader)(accessToken)).pipe((0, _rxjs.map)((response)=>response.data.items), (0, _rxjs.map)((items)=>(0, _adapters.adaptGenres)(items, limit)), (0, _rxjs.catchError)(_utils1.catchSpotifyError));
    }
    topArtists(accessToken, limit = 10, timeRange = _enums.TimeRange.LONG_TERM) {
        return this.httpService.get(`/me/top/artists?limit=${limit}&time_range=${timeRange}`, (0, _utils1.applyAuthorizationHeader)(accessToken)).pipe((0, _rxjs.map)((response)=>response.data.items), (0, _rxjs.map)(_adapters.adaptArtists), (0, _rxjs.catchError)(_utils1.catchSpotifyError));
    }
    topTracks(accessToken, limit = 10, timeRange = _enums.TimeRange.LONG_TERM) {
        return this.httpService.get(`/me/top/tracks?limit=${limit}&time_range=${timeRange}`, (0, _utils1.applyAuthorizationHeader)(accessToken)).pipe((0, _rxjs.map)((response)=>response.data.items), (0, _rxjs.map)(_adapters.adaptTracks), (0, _rxjs.catchError)(_utils1.catchSpotifyError));
    }
    artist(accessToken, id) {
        return this.httpService.get(`/artists/${id}`, (0, _utils1.applyAuthorizationHeader)(accessToken)).pipe((0, _rxjs.map)((response)=>response.data), (0, _rxjs.map)(_adapters.adaptArtist), (0, _rxjs.catchError)(_utils1.catchSpotifyError));
    }
    analysis(accessToken) {
        return this.topTracks(accessToken, 50).pipe((0, _rxjs.mergeMap)((tracks)=>{
            const tracksIds = tracks.map(({ id })=>id).join(',');
            return this.httpService.get(`/audio-features?ids=${tracksIds}`, (0, _utils1.applyAuthorizationHeader)(accessToken)).pipe((0, _rxjs.map)((response)=>response.data.audio_features), (0, _rxjs.map)((audioFeatures)=>audioFeatures.map((audioFeature)=>(0, _adapters.adaptAudioFeatures)(audioFeature))), (0, _rxjs.map)(_utils.analysisFactory), (0, _rxjs.catchError)(_utils1.catchSpotifyError));
        }));
    }
    constructor(httpService){
        this.httpService = httpService;
    }
};
StatisticsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService
    ])
], StatisticsService);

//# sourceMappingURL=statistics.service.js.map