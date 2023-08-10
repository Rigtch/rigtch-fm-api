"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _testing = require("@nestjs/testing");
const _rxjs = require("rxjs");
const _authcontroller = require("./auth.controller");
const _authservice = require("./auth.service");
(0, _vitest.describe)('AuthController', ()=>{
    const redirectUrl = 'http://test.com';
    let authController;
    let authService;
    (0, _vitest.beforeEach)(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _authcontroller.AuthController,
                {
                    provide: _authservice.AuthService,
                    useValue: {
                        token: _vitest.vi.fn(),
                        profile: _vitest.vi.fn()
                    }
                },
                {
                    provide: _config.ConfigService,
                    useValue: {
                        get: _vitest.vi.fn().mockReturnValue(redirectUrl)
                    }
                }
            ]
        }).compile();
        authController = module.get(_authcontroller.AuthController);
        authService = module.get(_authservice.AuthService);
    });
    (0, _vitest.test)('should be defined', ()=>{
        (0, _vitest.expect)(authController).toBeDefined();
    });
    (0, _vitest.test)('login should return undefined', ()=>{
        const { url, statusCode } = authController.login();
        (0, _vitest.expect)(url).toMatch(/authorize\?/);
        (0, _vitest.expect)(statusCode).toEqual(_common.HttpStatus.PERMANENT_REDIRECT);
    });
    (0, _vitest.test)('callback should return valid redirect path', async ()=>{
        const tokenResponse = {
            accessToken: '123',
            refreshToken: '456',
            expiresIn: 3600
        };
        _vitest.vi.spyOn(authService, 'token').mockReturnValue((0, _rxjs.of)(tokenResponse));
        const { accessToken, refreshToken } = tokenResponse;
        (0, _vitest.expect)(await authController.callback('code')).toEqual({
            url: `${redirectUrl}/api/authorize?${new URLSearchParams({
                accessToken,
                refreshToken
            })}`,
            statusCode: _common.HttpStatus.PERMANENT_REDIRECT
        });
    });
    (0, _vitest.test)('should refresh token', async ()=>{
        const secretData = {
            accessToken: '123',
            expiresIn: 3600
        };
        _vitest.vi.spyOn(authService, 'token').mockReturnValue((0, _rxjs.of)(secretData));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(authController.refresh('123'))).toEqual(secretData);
    });
    (0, _vitest.test)('should return profile', async ()=>{
        const profileMock = {
            id: '123',
            displayName: 'test',
            email: 'email@test.com',
            images: [
                {
                    url: 'http://test.com',
                    height: 100,
                    width: 100
                }
            ],
            followers: 23,
            country: 'BR',
            href: 'http://test.com'
        };
        _vitest.vi.spyOn(authService, 'profile').mockReturnValue((0, _rxjs.of)(profileMock));
        (0, _vitest.expect)(await (0, _rxjs.firstValueFrom)(authController.profile('123'))).toEqual(profileMock);
    });
});

//# sourceMappingURL=auth.controller.spec.js.map