"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StatisticsModule", {
    enumerable: true,
    get: function() {
        return StatisticsModule;
    }
});
const _common = require("@nestjs/common");
const _axios = require("@nestjs/axios");
const _config = require("@nestjs/config");
const _statisticsservice = require("./statistics.service");
const _statisticscontroller = require("./statistics.controller");
const _auth = require("../auth");
const _config1 = require("../../config");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let StatisticsModule = class StatisticsModule {
};
StatisticsModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _axios.HttpModule.registerAsync({
                useFactory: (configService)=>({
                        baseURL: configService.get(_config1.Environment.SPOTIFY_BASE_URL),
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                        }
                    }),
                inject: [
                    _config.ConfigService
                ]
            }),
            _auth.AuthModule
        ],
        controllers: [
            _statisticscontroller.StatisticsController
        ],
        providers: [
            _statisticsservice.StatisticsService
        ]
    })
], StatisticsModule);

//# sourceMappingURL=statistics.module.js.map