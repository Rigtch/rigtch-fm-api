"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _testing = require("@nestjs/testing");
const _rxjs = require("rxjs");
const _statisticscontroller = require("./statistics.controller");
const _statisticsservice = require("./statistics.service");
const _mocks = require("../../common/mocks");
(0, _vitest.describe)('StatisticsController', ()=>{
    let statisticsController;
    let statisticsService;
    (0, _vitest.beforeEach)(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _statisticscontroller.StatisticsController,
                {
                    provide: _statisticsservice.StatisticsService,
                    useValue: {
                        lastTracks: _vitest.vi.fn(),
                        topTracks: _vitest.vi.fn(),
                        topGenres: _vitest.vi.fn(),
                        topArtists: _vitest.vi.fn(),
                        artist: _vitest.vi.fn(),
                        analysis: _vitest.vi.fn()
                    }
                }
            ]
        }).compile();
        statisticsController = module.get(_statisticscontroller.StatisticsController);
        statisticsService = module.get(_statisticsservice.StatisticsService);
    });
    (0, _vitest.test)('should be defined', ()=>{
        (0, _vitest.expect)(statisticsController).toBeDefined();
    });
    (0, _vitest.describe)('LastTracks', ()=>{
        (0, _vitest.test)('should get last tracks', async ()=>{
            _vitest.vi.spyOn(statisticsService, 'lastTracks').mockReturnValue((0, _rxjs.of)((0, _mocks.spotifyResponseWithCursorsMockFactory)(_mocks.formattedTracksMock)));
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsController.lastTracks('awd', {}))).toEqual((0, _mocks.spotifyResponseWithCursorsMockFactory)(_mocks.formattedTracksMock));
        });
        (0, _vitest.test)('should get last tracks with limit query', async ()=>{
            const limit = 20;
            const formattedTracksWithLimitMock = Array.from({
                length: limit
            }, ()=>_mocks.formattedTrackMock);
            _vitest.vi.spyOn(statisticsService, 'lastTracks').mockReturnValue((0, _rxjs.of)((0, _mocks.spotifyResponseWithCursorsMockFactory)(formattedTracksWithLimitMock)));
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsController.lastTracks('awd', {
                limit
            }))).toEqual((0, _mocks.spotifyResponseWithCursorsMockFactory)(formattedTracksWithLimitMock));
        });
    });
    (0, _vitest.describe)('TopTracks', ()=>{
        (0, _vitest.test)('should get top tracks', async ()=>{
            _vitest.vi.spyOn(statisticsService, 'topTracks').mockReturnValue((0, _rxjs.of)((0, _mocks.spotifyResponseWithOffsetMockFactory)(_mocks.formattedTracksMock)));
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsController.topTracks('awd', {}))).toEqual((0, _mocks.spotifyResponseWithOffsetMockFactory)(_mocks.formattedTracksMock));
        });
        (0, _vitest.test)('should get top tracks with limit query', async ()=>{
            const limit = 20;
            const formattedTracksWithLimitMock = Array.from({
                length: limit
            }, ()=>_mocks.formattedTrackMock);
            _vitest.vi.spyOn(statisticsService, 'topTracks').mockReturnValue((0, _rxjs.of)((0, _mocks.spotifyResponseWithOffsetMockFactory)(formattedTracksWithLimitMock)));
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsController.topTracks('awd', {
                limit
            }))).toEqual((0, _mocks.spotifyResponseWithOffsetMockFactory)(formattedTracksWithLimitMock));
        });
    });
    (0, _vitest.describe)('TopGenres', ()=>{
        (0, _vitest.test)('should get top genres', async ()=>{
            _vitest.vi.spyOn(statisticsService, 'topGenres').mockReturnValue((0, _rxjs.of)(_mocks.topGenresMock));
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsController.topGenres('awd', {}))).toEqual(_mocks.topGenresMock);
        });
        (0, _vitest.test)('should get top genres with limit argument', async ()=>{
            const limit = 20;
            const genresWithLimitMock = {
                genres: Array.from({
                    length: limit
                }, ()=>'genre')
            };
            _vitest.vi.spyOn(statisticsService, 'topGenres').mockReturnValue((0, _rxjs.of)(genresWithLimitMock));
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsController.topGenres('awd', {
                limit
            }))).toEqual(genresWithLimitMock);
        });
    });
    (0, _vitest.describe)('TopArtists', ()=>{
        (0, _vitest.test)('should get top artists', async ()=>{
            _vitest.vi.spyOn(statisticsService, 'topArtists').mockReturnValue((0, _rxjs.of)((0, _mocks.spotifyResponseWithOffsetMockFactory)(_mocks.formattedArtistsMock)));
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsController.topArtists('awd', {}))).toEqual((0, _mocks.spotifyResponseWithOffsetMockFactory)(_mocks.formattedArtistsMock));
        });
        (0, _vitest.test)('should get top artists with limit argument', async ()=>{
            const limit = 20;
            const formattedArtistsWithLimitMock = Array.from({
                length: limit
            }, ()=>_mocks.formattedArtistMock);
            _vitest.vi.spyOn(statisticsService, 'topArtists').mockReturnValue((0, _rxjs.of)((0, _mocks.spotifyResponseWithOffsetMockFactory)(formattedArtistsWithLimitMock)));
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsController.topArtists('awd', {
                limit
            }))).toEqual((0, _mocks.spotifyResponseWithOffsetMockFactory)(formattedArtistsWithLimitMock));
        });
    });
    (0, _vitest.test)('should get artist', async ()=>{
        _vitest.vi.spyOn(statisticsService, 'artist').mockReturnValue((0, _rxjs.of)(_mocks.formattedArtistMock));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsController.artist('awd', '123'))).toEqual(_mocks.formattedArtistMock);
    });
    (0, _vitest.test)('should get analysis', async ()=>{
        _vitest.vi.spyOn(statisticsService, 'analysis').mockReturnValue((0, _rxjs.of)(_mocks.analysisMock));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(statisticsController.analysis('awd'))).toEqual(_mocks.analysisMock);
    });
});

//# sourceMappingURL=statistics.controller.spec.js.map