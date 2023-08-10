"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Token", {
    enumerable: true,
    get: function() {
        return Token;
    }
});
const _common = require("@nestjs/common");
const Token = (0, _common.createParamDecorator)((data, context)=>{
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.slice(7);
    if (!token) throw new _common.UnauthorizedException('No value was provided for Authentication');
    return token;
});

//# sourceMappingURL=token.decorator.js.map