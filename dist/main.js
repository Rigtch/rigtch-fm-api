"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _config = require("@nestjs/config");
const _cookieparser = /*#__PURE__*/ _interop_require_default(require("cookie-parser"));
const _swagger = require("@nestjs/swagger");
const _config1 = require("./config/index");
const _app = require("./modules/app");
const _enums = require("./modules/auth/enums");
const _constants = require("./modules/auth/constants");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function bootstrap() {
    const app = await _core.NestFactory.create(_app.AppModule);
    const configService = app.get(_config.ConfigService);
    const documentConfig = new _swagger.DocumentBuilder().setTitle('Rigtch Music API').addBearerAuth({
        type: 'http',
        scheme: _constants.BEARER,
        bearerFormat: 'JWT'
    }, _enums.AuthenticationType.ACCESS_TOKEN).addBearerAuth({
        type: 'http',
        scheme: _constants.BEARER,
        bearerFormat: 'JWT'
    }, _enums.AuthenticationType.REFRESH_TOKEN).build();
    const document = _swagger.SwaggerModule.createDocument(app, documentConfig);
    _swagger.SwaggerModule.setup('api', app, document);
    app.enableCors({
        origin: configService.get(_config1.Environment.CLIENT_CALLBACK_URL),
        // origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true
    });
    app.use((0, _cookieparser.default)());
    await app.startAllMicroservices();
    await app.listen(+configService.get(_config1.Environment.PORT) || 4000);
}
bootstrap();

//# sourceMappingURL=main.js.map