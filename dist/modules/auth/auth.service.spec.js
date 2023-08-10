"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _axios = require("@nestjs/axios");
const _config = require("@nestjs/config");
const _jwt = require("@nestjs/jwt");
const _testing = require("@nestjs/testing");
const _rxjs = require("rxjs");
const _authservice = require("./auth.service");
const _mocks = require("../../common/mocks");
(0, _vitest.describe)('AuthService', ()=>{
    let authService;
    let jwtService;
    let httpService;
    let configService;
    (0, _vitest.beforeEach)(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _authservice.AuthService,
                {
                    provide: _jwt.JwtService,
                    useValue: {
                        sign: _vitest.vi.fn()
                    }
                },
                {
                    provide: _axios.HttpService,
                    useValue: {
                        post: _vitest.vi.fn(),
                        get: _vitest.vi.fn()
                    }
                },
                {
                    provide: _config.ConfigService,
                    useValue: {
                        get: _vitest.vi.fn()
                    }
                }
            ]
        }).compile();
        authService = module.get(_authservice.AuthService);
        jwtService = module.get(_jwt.JwtService);
        httpService = module.get(_axios.HttpService);
        configService = module.get(_config.ConfigService);
    });
    (0, _vitest.test)('should be defined', ()=>{
        (0, _vitest.expect)(authService).toBeDefined();
    });
    (0, _vitest.test)('should login', ()=>{
        const profile = {
            provider: 'spotify',
            id: '123',
            displayName: 'John Doe',
            username: 'john.doe',
            photos: [
                'example'
            ],
            profileUrl: 'example.com',
            country: 'US',
            followers: 0,
            product: 'premium',
            _raw: 'raw',
            _json: {}
        };
        jwtService.sign = _vitest.vi.fn().mockReturnValue('token');
        (0, _vitest.expect)(authService.login(profile)).toEqual('token');
    });
    (0, _vitest.describe)('token', ()=>{
        (0, _vitest.test)('should refresh token', async ()=>{
            configService.get = _vitest.vi.fn().mockReturnValue('value');
            const response = {
                data: {
                    access_token: 'token',
                    expires_in: 3600
                }
            };
            const expectedResponse = {
                accessToken: 'token',
                expiresIn: 3600
            };
            httpService.post = _vitest.vi.fn().mockImplementation((_url, parameters)=>{
                if (parameters.get('grant_type') === 'refresh_token') {
                    return (0, _rxjs.of)(response);
                }
            });
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(authService.token({
                refreshToken: 'refresh'
            }))).toEqual(expectedResponse);
        });
        (0, _vitest.test)('should authorize and get tokens', async ()=>{
            configService.get = _vitest.vi.fn().mockReturnValue('value');
            const response = {
                data: {
                    access_token: 'token',
                    refresh_token: 'refresh',
                    expires_in: 3600
                }
            };
            const expectedResponse = {
                accessToken: 'token',
                refreshToken: 'refresh',
                expiresIn: 3600
            };
            httpService.post = _vitest.vi.fn().mockImplementation((_url, parameters)=>{
                if (parameters.get('grant_type') === 'authorization_code') {
                    return (0, _rxjs.of)(response);
                }
            });
            (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(authService.token({
                code: 'code'
            }))).toEqual(expectedResponse);
        });
    });
    (0, _vitest.test)('should return profile', async ()=>{
        const response = {
            data: _mocks.spotifyProfileMock
        };
        httpService.get = _vitest.vi.fn().mockReturnValue((0, _rxjs.of)(response));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(authService.profile('token'))).toEqual(_mocks.formattedProfileMock);
    });
});

//# sourceMappingURL=auth.service.spec.js.map