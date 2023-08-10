"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _axios = require("@nestjs/axios");
const _testing = require("@nestjs/testing");
const _rxjs = require("rxjs");
const _common = require("@nestjs/common");
const _playerservice = require("./player.service");
const _mocks = require("../../common/mocks");
const _utils = require("../../utils");
const forbiddenExceptionObserver = (0, _rxjs.throwError)(()=>({
        response: {
            data: {
                error: {
                    status: 403
                }
            }
        }
    }));
(0, _vitest.describe)('PlayerService', ()=>{
    let playerService;
    let httpService;
    (0, _vitest.beforeEach)(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _playerservice.PlayerService,
                {
                    provide: _axios.HttpService,
                    useValue: {
                        get: _vitest.vi.fn(),
                        put: _vitest.vi.fn().mockReturnValue((0, _rxjs.of)(''))
                    }
                }
            ]
        }).compile();
        playerService = module.get(_playerservice.PlayerService);
        httpService = module.get(_axios.HttpService);
    });
    (0, _vitest.test)('should be defined', ()=>{
        (0, _vitest.expect)(playerService).toBeDefined();
    });
    (0, _vitest.describe)('availableDevices', ()=>{
        (0, _vitest.test)('should get available devices', async ()=>{
            _vitest.vi.spyOn(httpService, 'get').mockReturnValue((0, _rxjs.of)((0, _utils.axiosResponseMockFactory)({
                devices: _mocks.spotifyDevicesMock
            })));
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(playerService.availableDevices('awd'))).toEqual(_mocks.formattedDevicesMock);
        });
        (0, _vitest.test)('should throw Forbidden expception because no device is currently playing', async ()=>{
            _vitest.vi.spyOn(httpService, 'get').mockReturnValue((0, _rxjs.of)((0, _utils.axiosResponseMockFactory)({
                devices: []
            })));
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(playerService.availableDevices('awd').pipe((0, _rxjs.catchError)((error)=>[
                    error
                ])))).toBeInstanceOf(_common.ForbiddenException);
        });
    });
    (0, _vitest.describe)('currentPlaybackState', ()=>{
        (0, _vitest.test)('should get playback state', async ()=>{
            _vitest.vi.spyOn(httpService, 'get').mockReturnValue((0, _rxjs.of)((0, _utils.axiosResponseMockFactory)(_mocks.spotifyPlaybackStateMock)));
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(playerService.currentPlaybackState('awd'))).toEqual(_mocks.formattedPlaybackStateMock);
        });
        (0, _vitest.test)('should throw Forbidden expception because No device is currently playing', async ()=>{
            _vitest.vi.spyOn(httpService, 'get').mockReturnValue((0, _rxjs.of)((0, _utils.axiosResponseMockFactory)('')));
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(playerService.currentPlaybackState('awd').pipe((0, _rxjs.catchError)((error)=>[
                    error
                ])))).toBeInstanceOf(_common.ForbiddenException);
        });
    });
    (0, _vitest.describe)('pausePlayer', ()=>{
        (0, _vitest.test)('should pause player', async ()=>{
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(playerService.pausePlayer('awd'))).toEqual({
                success: true
            });
        });
        (0, _vitest.test)('should throw Forbidden expception because no device is currently playing', async ()=>{
            _vitest.vi.spyOn(httpService, 'put').mockReturnValue(forbiddenExceptionObserver);
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(playerService.pausePlayer('awd').pipe((0, _rxjs.catchError)((error)=>[
                    error
                ])))).toBeInstanceOf(_common.ForbiddenException);
        });
    });
    (0, _vitest.describe)('resumePlayer', ()=>{
        (0, _vitest.test)('should resume player', async ()=>{
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(playerService.resumePlayer('awd'))).toEqual({
                success: true
            });
        });
        (0, _vitest.test)('should throw Forbidden expception because no device is currently playing', async ()=>{
            _vitest.vi.spyOn(httpService, 'put').mockReturnValue(forbiddenExceptionObserver);
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(playerService.resumePlayer('awd').pipe((0, _rxjs.catchError)((error)=>[
                    error
                ])))).toBeInstanceOf(_common.ForbiddenException);
        });
    });
});

//# sourceMappingURL=player.service.spec.js.map