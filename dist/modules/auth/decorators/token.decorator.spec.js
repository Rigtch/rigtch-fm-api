"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _common = require("@nestjs/common");
const _vitestmockextended = require("vitest-mock-extended");
const _tokendecorator = require("./token.decorator");
const _utils = require("../../../utils");
(0, _vitest.describe)('AccessToken', ()=>{
    const factory = (0, _utils.getParameterDecoratorFactory)(_tokendecorator.Token);
    (0, _vitest.test)('should be defined', ()=>{
        (0, _vitest.expect)(_tokendecorator.Token).toBeDefined();
    });
    (0, _vitest.test)('should return the access token from header', ()=>{
        const accessToken = 'test';
        (0, _vitest.expect)(factory(undefined, (0, _vitestmockextended.mock)({
            switchToHttp: _vitest.vi.fn().mockReturnValue({
                getRequest: _vitest.vi.fn().mockReturnValue({
                    headers: {
                        authorization: `Bearer ${accessToken}`
                    }
                })
            }),
            getType: _vitest.vi.fn().mockReturnValue('http')
        }))).toEqual(accessToken);
    });
    (0, _vitest.test)('should throw unauthorized exception if no access token is provided', ()=>{
        (0, _vitest.expect)(()=>factory(undefined, (0, _vitestmockextended.mock)({
                switchToHttp: _vitest.vi.fn().mockReturnValue({
                    getRequest: _vitest.vi.fn().mockReturnValue({})
                }),
                getType: _vitest.vi.fn().mockReturnValue('http')
            }))).toThrowError(_common.UnauthorizedException);
    });
});

//# sourceMappingURL=token.decorator.spec.js.map