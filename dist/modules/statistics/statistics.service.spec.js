"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _axios = require("@nestjs/axios");
const _testing = require("@nestjs/testing");
const _rxjs = require("rxjs");
const _statisticsservice = require("./statistics.service");
const _mocks = require("../../common/mocks");
const _utils = require("../../utils");
(0, _vitest.describe)('StatisticsService', ()=>{
    let statisticsService;
    let httpService;
    (0, _vitest.beforeEach)(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _statisticsservice.StatisticsService,
                {
                    provide: _axios.HttpService,
                    useValue: {
                        get: _vitest.vi.fn()
                    }
                }
            ]
        }).compile();
        statisticsService = module.get(_statisticsservice.StatisticsService);
        httpService = module.get(_axios.HttpService);
    });
    (0, _vitest.test)('should be defined', ()=>{
        (0, _vitest.expect)(statisticsService).toBeDefined();
    });
    (0, _vitest.test)('should get last tracks', async ()=>{
        _vitest.vi.spyOn(httpService, 'get').mockReturnValue((0, _rxjs.of)((0, _utils.axiosResponseMockFactory)((0, _mocks.spotifyResponseWithCursorsMockFactory)(Array.from({
            length: 5
        }).map(()=>({
                track: _mocks.spotifyTrackMock,
                played_at: '2022-11-26T11:01:10.040Z'
            }))))));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsService.lastTracks('awd'))).toEqual((0, _mocks.spotifyResponseWithCursorsMockFactory)(_mocks.formattedTracksMock));
    });
    (0, _vitest.test)('should get top artists', async ()=>{
        _vitest.vi.spyOn(httpService, 'get').mockReturnValue((0, _rxjs.of)((0, _utils.axiosResponseMockFactory)((0, _mocks.spotifyResponseWithOffsetMockFactory)(_mocks.spotifyArtistsMock))));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsService.topArtists('awd'))).toEqual((0, _mocks.spotifyResponseWithOffsetMockFactory)(_mocks.formattedArtistsMock));
    });
    (0, _vitest.test)('should get top genres', async ()=>{
        _vitest.vi.spyOn(httpService, 'get').mockReturnValue((0, _rxjs.of)((0, _utils.axiosResponseMockFactory)((0, _mocks.spotifyResponseMockFactory)(_mocks.spotifyArtistsMock))));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsService.topGenres('awd', 3))).toEqual(_mocks.topGenresMock);
    });
    (0, _vitest.test)('should get top tracks', async ()=>{
        _vitest.vi.spyOn(httpService, 'get').mockReturnValue((0, _rxjs.of)((0, _utils.axiosResponseMockFactory)((0, _mocks.spotifyResponseWithOffsetMockFactory)(_mocks.spotifyTracksMock))));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsService.topTracks('awd'))).toEqual((0, _mocks.spotifyResponseWithOffsetMockFactory)(_mocks.formattedTracksMock));
    });
    (0, _vitest.test)('should get artist with given id', async ()=>{
        _vitest.vi.spyOn(httpService, 'get').mockReturnValue((0, _rxjs.of)((0, _utils.axiosResponseMockFactory)(_mocks.spotifyArtistMock)));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsService.artist('awd', 'some id'))).toEqual(_mocks.formattedArtistMock);
    });
    (0, _vitest.test)('should generate analysis', async ()=>{
        _vitest.vi.spyOn(statisticsService, 'topTracks').mockReturnValue((0, _rxjs.of)((0, _mocks.spotifyResponseWithOffsetMockFactory)(_mocks.formattedTracksMock)));
        _vitest.vi.spyOn(httpService, 'get').mockReturnValue((0, _rxjs.of)((0, _utils.axiosResponseMockFactory)({
            audio_features: [
                _mocks.spotifyAudioFeaturesMock
            ]
        })));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsService.analysis('awd'))).toEqual(_mocks.analysisMock);
    });
});

//# sourceMappingURL=statistics.service.spec.js.map