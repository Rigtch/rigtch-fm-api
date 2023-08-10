"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _testing = require("@nestjs/testing");
const _rxjs = require("rxjs");
const _playercontroller = require("./player.controller");
const _playerservice = require("./player.service");
const _mocks = require("../../common/mocks");
(0, _vitest.describe)('PlayerController', ()=>{
    let playerController;
    let playerService;
    (0, _vitest.beforeEach)(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _playercontroller.PlayerController,
                {
                    provide: _playerservice.PlayerService,
                    useValue: {
                        availableDevices: _vitest.vi.fn(),
                        currentPlaybackState: _vitest.vi.fn(),
                        pausePlayer: _vitest.vi.fn(),
                        resumePlayer: _vitest.vi.fn()
                    }
                }
            ]
        }).compile();
        playerController = module.get(_playercontroller.PlayerController);
        playerService = module.get(_playerservice.PlayerService);
    });
    (0, _vitest.test)('should be defined', ()=>{
        (0, _vitest.expect)(playerController).toBeDefined();
    });
    (0, _vitest.test)('should get available devices', async ()=>{
        _vitest.vi.spyOn(playerService, 'availableDevices').mockReturnValue((0, _rxjs.of)(_mocks.formattedDevicesMock));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(playerController.availableDevices('awd'))).toEqual(_mocks.formattedDevicesMock);
    });
    (0, _vitest.test)('should get currentPlaybackState', async ()=>{
        _vitest.vi.spyOn(playerService, 'currentPlaybackState').mockReturnValue((0, _rxjs.of)(_mocks.formattedPlaybackStateMock));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(playerController.currentPlaybackState('awd'))).toEqual(_mocks.formattedPlaybackStateMock);
    });
    (0, _vitest.test)('should pause player', async ()=>{
        _vitest.vi.spyOn(playerService, 'pausePlayer').mockReturnValue((0, _rxjs.of)({
            success: true
        }));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(playerController.pausePlayer('awd'))).toEqual({
            success: true
        });
    });
    (0, _vitest.test)('should resume player', async ()=>{
        _vitest.vi.spyOn(playerService, 'resumePlayer').mockReturnValue((0, _rxjs.of)({
            success: true
        }));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(playerController.resumePlayer('awd'))).toEqual({
            success: true
        });
    });
});

//# sourceMappingURL=player.controller.spec.js.map