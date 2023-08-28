"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StatisticsController", {
    enumerable: true,
    get: function() {
        return StatisticsController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _statisticsservice = require("./statistics.service");
const _dtos = require("./dtos/index");
const _decorators = require("./decorators/index");
const _auth = require("../auth");
const _enums = require("../auth/enums");
const _dtos1 = require("../../common/dtos");
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
let StatisticsController = class StatisticsController {
    lastTracks(accessToken, { limit }) {
        return this.statisticsService.lastTracks(accessToken, limit);
    }
    topTracks(accessToken, { limit, timeRange, offset }) {
        return this.statisticsService.topTracks(accessToken, limit, timeRange, offset);
    }
    topGenres(accessToken, { limit, timeRange, offset }) {
        return this.statisticsService.topGenres(accessToken, limit, timeRange, offset);
    }
    topArtists(accessToken, { limit, timeRange, offset }) {
        return this.statisticsService.topArtists(accessToken, limit, timeRange, offset);
    }
    artist(accessToken, id) {
        return this.statisticsService.artist(accessToken, id);
    }
    analysis(accessToken) {
        return this.statisticsService.analysis(accessToken);
    }
    constructor(statisticsService){
        this.statisticsService = statisticsService;
    }
};
_ts_decorate([
    (0, _common.Get)('/last-tracks'),
    (0, _decorators.ApiItemQuery)(),
    (0, _swagger.ApiOkResponse)({
        description: 'Last tracks has been succesfully found',
        type: [
            _dtos1.Track
        ]
    }),
    _ts_param(0, (0, _auth.Token)()),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _dtos.ItemQuery === "undefined" ? Object : _dtos.ItemQuery
    ])
], StatisticsController.prototype, "lastTracks", null);
_ts_decorate([
    (0, _common.Get)('/top-tracks'),
    (0, _decorators.ApiItemQuery)(true),
    (0, _swagger.ApiOkResponse)({
        description: 'Top tracks has been succesfully found',
        type: [
            _dtos1.Track
        ]
    }),
    _ts_param(0, (0, _auth.Token)()),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _dtos.TopItemQuery === "undefined" ? Object : _dtos.TopItemQuery
    ])
], StatisticsController.prototype, "topTracks", null);
_ts_decorate([
    (0, _common.Get)('/top-genres'),
    (0, _decorators.ApiItemQuery)(true),
    (0, _swagger.ApiOkResponse)({
        description: 'Top genres has been succesfully found',
        type: _dtos1.Genres
    }),
    _ts_param(0, (0, _auth.Token)()),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _dtos.TopItemQuery === "undefined" ? Object : _dtos.TopItemQuery
    ])
], StatisticsController.prototype, "topGenres", null);
_ts_decorate([
    (0, _common.Get)('/top-artists'),
    (0, _decorators.ApiItemQuery)(true),
    (0, _swagger.ApiOkResponse)({
        description: 'Top artists has been succesfully found',
        type: [
            _dtos1.Artist
        ]
    }),
    _ts_param(0, (0, _auth.Token)()),
    _ts_param(1, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof _dtos.TopItemQuery === "undefined" ? Object : _dtos.TopItemQuery
    ])
], StatisticsController.prototype, "topArtists", null);
_ts_decorate([
    (0, _common.Get)('/artist'),
    (0, _swagger.ApiQuery)({
        name: 'id',
        type: String,
        required: true
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'Artist has been succesfully found',
        type: _dtos1.Artist
    }),
    _ts_param(0, (0, _auth.Token)()),
    _ts_param(1, (0, _common.Query)('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        String
    ])
], StatisticsController.prototype, "artist", null);
_ts_decorate([
    (0, _common.Get)('/analysis'),
    (0, _swagger.ApiOkResponse)({
        description: 'Analysis has been succesfully generated',
        type: _dtos1.Analysis
    }),
    _ts_param(0, (0, _auth.Token)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ])
], StatisticsController.prototype, "analysis", null);
StatisticsController = _ts_decorate([
    (0, _common.Controller)('statistics'),
    (0, _swagger.ApiTags)('statistics'),
    (0, _auth.ApiAuth)(_enums.AuthenticationType.ACCESS_TOKEN),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _statisticsservice.StatisticsService === "undefined" ? Object : _statisticsservice.StatisticsService
    ])
], StatisticsController);

//# sourceMappingURL=statistics.controller.js.map