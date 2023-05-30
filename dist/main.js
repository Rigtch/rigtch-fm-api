/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(5), exports);


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(6);
const apollo_1 = __webpack_require__(7);
const graphql_1 = __webpack_require__(8);
const Joi = __webpack_require__(9);
const config_1 = __webpack_require__(2);
const adapter_1 = __webpack_require__(10);
const auth_1 = __webpack_require__(19);
const statistics_1 = __webpack_require__(60);
const player_1 = __webpack_require__(68);
const config_2 = __webpack_require__(56);
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_1.AuthModule,
            adapter_1.AdapterModule,
            statistics_1.StatisticsModule,
            player_1.PlayerModule,
            graphql_1.GraphQLModule.forRootAsync({
                driver: apollo_1.ApolloDriver,
                useFactory: (configService) => ({
                    cache: 'bounded',
                    autoSchemaFile: true,
                    context: ({ req, res }) => ({ req, res }),
                    playground: {
                        settings: {
                            'request.credentials': 'include',
                        },
                    },
                    introspection: true,
                    cors: {
                        credentials: true,
                        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
                        origin: configService.get(config_2.Environment.CLIENT_CALLBACK_URL),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: './.env',
                validationSchema: Joi.object({
                    PORT: Joi.number().default(4000),
                    SPOTIFY_CLIENT_ID: Joi.string().required(),
                    SPOTIFY_CLIENT_SECRET: Joi.string().required(),
                    SPOTIFY_CALLBACK_URL: Joi.string().required(),
                    SPOTIFY_BASE_URL: Joi.string().required(),
                    SPOTIFY_ACCOUNTS_URL: Joi.string().required(),
                    CLIENT_CALLBACK_URL: Joi.string().required(),
                    JWT_SECRET: Joi.string().required(),
                }),
            }),
        ],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/apollo");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/graphql");

/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("joi");

/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(11), exports);
__exportStar(__webpack_require__(12), exports);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdapterModule = void 0;
const common_1 = __webpack_require__(6);
const adapter_service_1 = __webpack_require__(12);
let AdapterModule = class AdapterModule {
};
AdapterModule = __decorate([
    (0, common_1.Module)({
        providers: [adapter_service_1.AdapterService],
        exports: [adapter_service_1.AdapterService],
    })
], AdapterModule);
exports.AdapterModule = AdapterModule;


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdapterService = void 0;
const common_1 = __webpack_require__(6);
const utils_1 = __webpack_require__(13);
let AdapterService = class AdapterService {
    constructor() {
        this.adaptArtist = ({ name, genres, href, images, }) => ({
            name,
            genres,
            href,
            images,
        });
        this.adaptArtists = (artists) => artists.map(artist => this.adaptArtist(artist));
        this.adaptGenres = (artists, limit) => ({
            genres: (0, utils_1.getMostFrequentItems)(artists.flatMap(({ genres }) => genres), limit),
        });
        this.adaptTrack = ({ name, album, artists, external_urls: { spotify: href }, duration_ms, progress_ms, played_at, }) => (Object.assign(Object.assign({ name, album: { name: album.name, images: album.images }, artists: artists.map(({ name, id, href }) => ({ name, id, href })), href, duration: duration_ms }, (progress_ms && { progress: progress_ms })), (played_at && { playedAt: played_at })));
        this.adaptTracks = (tracks) => tracks.map(track => this.adaptTrack(track));
        this.adaptProfile = ({ id, display_name, email, images, country, external_urls: { spotify: href }, followers, }) => ({
            id,
            displayName: display_name,
            email,
            images,
            country,
            href,
            followers: followers.total,
        });
        this.adaptDevices = (devices) => devices.map(({ id, name, type, is_active: isActive, is_private_session: isPrivateSession, is_restricted: isRestricted, volume_percent: volumePercent, }) => ({
            id,
            name,
            type,
            isActive,
            isPrivateSession,
            isRestricted,
            volumePercent,
        }));
        this.adaptPlaybackState = ({ device, repeat_state, shuffle_state, is_playing, item, }) => {
            const [formattedDevice] = this.adaptDevices([device]);
            const [formattedTrack] = this.adaptTracks([item]);
            return {
                device: formattedDevice,
                repeatState: repeat_state,
                shuffleState: shuffle_state,
                isPlaying: is_playing,
                track: formattedTrack,
            };
        };
    }
};
AdapterService = __decorate([
    (0, common_1.Injectable)()
], AdapterService);
exports.AdapterService = AdapterService;


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(14), exports);
__exportStar(__webpack_require__(15), exports);
__exportStar(__webpack_require__(16), exports);
__exportStar(__webpack_require__(18), exports);


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getMostFrequentItems = void 0;
function getMostFrequentItems(array, limit = 1) {
    if (array.length === 0)
        return array;
    const frequencies = {};
    for (const item of array) {
        if (frequencies[item] === undefined) {
            frequencies[item] = 1;
        }
        else {
            frequencies[item] = frequencies[item] + 1;
        }
    }
    const frequencyArray = [];
    for (const key in frequencies) {
        frequencyArray.push([frequencies[key], key]);
    }
    frequencyArray.sort((a, b) => {
        return b[0] - a[0];
    });
    const mostFrequentItems = [];
    for (let index = 0; index < limit; index++) {
        mostFrequentItems.push(frequencyArray[index][1]);
    }
    return mostFrequentItems;
}
exports.getMostFrequentItems = getMostFrequentItems;


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.catchSpotifyError = void 0;
const common_1 = __webpack_require__(6);
const catchSpotifyError = error => {
    var _a;
    console.error(error);
    const { response: { data, status }, } = error;
    if ((data === null || data === void 0 ? void 0 : data.error) === 'invalid_grant')
        throw new common_1.UnauthorizedException('Invalid token');
    if (status === 401)
        throw new common_1.UnauthorizedException((_a = data === null || data === void 0 ? void 0 : data.error) === null || _a === void 0 ? void 0 : _a.message);
    if (status === 403 &&
        data === 'User not registered in the Developer Dashboard')
        throw new common_1.ForbiddenException('User not registered in the Developer Dashboard');
    throw new common_1.InternalServerErrorException('Something went wrong with fetching data from spotify API', data === null || data === void 0 ? void 0 : data.error);
};
exports.catchSpotifyError = catchSpotifyError;


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getParameterDecoratorFactory = void 0;
const constants_1 = __webpack_require__(17);
function getParameterDecoratorFactory(decorator) {
    class Test {
        test(value) { }
    }
    __decorate([
        __param(0, decorator()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Test.prototype, "test", null);
    const arguments_ = Reflect.getMetadata(constants_1.ROUTE_ARGS_METADATA, Test, 'test');
    return arguments_[Object.keys(arguments_)[0]].factory;
}
exports.getParameterDecoratorFactory = getParameterDecoratorFactory;


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("@nestjs/common/constants");

/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.applyAuthorizationHeader = void 0;
const applyAuthorizationHeader = (accessToken) => ({
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
});
exports.applyAuthorizationHeader = applyAuthorizationHeader;


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(20), exports);
__exportStar(__webpack_require__(22), exports);
__exportStar(__webpack_require__(25), exports);
__exportStar(__webpack_require__(47), exports);
__exportStar(__webpack_require__(51), exports);
__exportStar(__webpack_require__(53), exports);
__exportStar(__webpack_require__(58), exports);
__exportStar(__webpack_require__(59), exports);


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(21), exports);


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.spotifyAuthorizationScopes = void 0;
exports.spotifyAuthorizationScopes = [
    'user-follow-read',
    'user-read-recently-played',
    'user-modify-playback-state',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-read-playback-position',
    'user-top-read',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'app-remote-control',
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-library-modify',
    'user-library-read',
];


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(23), exports);
__exportStar(__webpack_require__(24), exports);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshToken = void 0;
const common_1 = __webpack_require__(6);
const graphql_1 = __webpack_require__(8);
exports.RefreshToken = (0, common_1.createParamDecorator)((data, context) => {
    var _a, _b, _c, _d;
    const request = context.getType() === 'http'
        ? context.switchToHttp().getRequest()
        : graphql_1.GqlExecutionContext.create(context).getContext().req;
    const refreshToken = (_b = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a['refresh-token']) !== null && _b !== void 0 ? _b : (_d = (_c = request.headers) === null || _c === void 0 ? void 0 : _c.authorization) === null || _d === void 0 ? void 0 : _d.slice(6);
    if (!refreshToken)
        throw new common_1.UnauthorizedException('No value was provided for Authentication');
    return refreshToken;
});


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccessToken = void 0;
const common_1 = __webpack_require__(6);
const graphql_1 = __webpack_require__(8);
exports.AccessToken = (0, common_1.createParamDecorator)((data, context) => {
    var _a, _b, _c, _d;
    const request = context.getType() === 'http'
        ? context.switchToHttp().getRequest()
        : graphql_1.GqlExecutionContext.create(context).getContext().req;
    const accessToken = (_b = (_a = request.cookies) === null || _a === void 0 ? void 0 : _a['access-token']) !== null && _b !== void 0 ? _b : (_d = (_c = request.headers) === null || _c === void 0 ? void 0 : _c.authorization) === null || _d === void 0 ? void 0 : _d.slice(7);
    if (!accessToken)
        throw new common_1.UnauthorizedException('No value was provided for Authentication');
    return accessToken;
});


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(26), exports);
__exportStar(__webpack_require__(46), exports);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileDto = void 0;
const graphql_1 = __webpack_require__(8);
const dtos_1 = __webpack_require__(27);
let ProfileDto = class ProfileDto {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProfileDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProfileDto.prototype, "displayName", void 0);
__decorate([
    (0, graphql_1.Field)(() => [dtos_1.ImageDto]),
    __metadata("design:type", Array)
], ProfileDto.prototype, "images", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], ProfileDto.prototype, "followers", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProfileDto.prototype, "country", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProfileDto.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ProfileDto.prototype, "href", void 0);
ProfileDto = __decorate([
    (0, graphql_1.ObjectType)()
], ProfileDto);
exports.ProfileDto = ProfileDto;


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(28), exports);
__exportStar(__webpack_require__(29), exports);
__exportStar(__webpack_require__(30), exports);
__exportStar(__webpack_require__(31), exports);
__exportStar(__webpack_require__(32), exports);
__exportStar(__webpack_require__(33), exports);
__exportStar(__webpack_require__(44), exports);
__exportStar(__webpack_require__(45), exports);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImageDto = void 0;
const graphql_1 = __webpack_require__(8);
let ImageDto = class ImageDto {
};
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], ImageDto.prototype, "height", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], ImageDto.prototype, "width", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ImageDto.prototype, "url", void 0);
ImageDto = __decorate([
    (0, graphql_1.ObjectType)()
], ImageDto);
exports.ImageDto = ImageDto;


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Album = void 0;
const graphql_1 = __webpack_require__(8);
const _1 = __webpack_require__(27);
let Album = class Album {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Album.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Album.prototype, "artist", void 0);
__decorate([
    (0, graphql_1.Field)(() => [_1.ImageDto]),
    __metadata("design:type", Array)
], Album.prototype, "images", void 0);
Album = __decorate([
    (0, graphql_1.ObjectType)()
], Album);
exports.Album = Album;


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TrackArtist = exports.Artist = void 0;
const graphql_1 = __webpack_require__(8);
const _1 = __webpack_require__(27);
let Artist = class Artist {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Artist.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], Artist.prototype, "genres", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Artist.prototype, "href", void 0);
__decorate([
    (0, graphql_1.Field)(() => [_1.ImageDto]),
    __metadata("design:type", Array)
], Artist.prototype, "images", void 0);
Artist = __decorate([
    (0, graphql_1.ObjectType)()
], Artist);
exports.Artist = Artist;
let TrackArtist = class TrackArtist {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], TrackArtist.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], TrackArtist.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], TrackArtist.prototype, "href", void 0);
TrackArtist = __decorate([
    (0, graphql_1.ObjectType)()
], TrackArtist);
exports.TrackArtist = TrackArtist;


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Track = void 0;
const graphql_1 = __webpack_require__(8);
const _1 = __webpack_require__(27);
let Track = class Track {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Track.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Track.prototype, "href", void 0);
__decorate([
    (0, graphql_1.Field)(() => [_1.TrackArtist]),
    __metadata("design:type", Array)
], Track.prototype, "artists", void 0);
__decorate([
    (0, graphql_1.Field)(() => _1.Album),
    __metadata("design:type", typeof (_a = typeof _1.Album !== "undefined" && _1.Album) === "function" ? _a : Object)
], Track.prototype, "album", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], Track.prototype, "duration", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], Track.prototype, "progress", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Track.prototype, "playedAt", void 0);
Track = __decorate([
    (0, graphql_1.ObjectType)()
], Track);
exports.Track = Track;


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Device = void 0;
const graphql_1 = __webpack_require__(8);
let Device = class Device {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Device.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Device.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Device.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], Device.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], Device.prototype, "isPrivateSession", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], Device.prototype, "isRestricted", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], Device.prototype, "volumePercent", void 0);
Device = __decorate([
    (0, graphql_1.ObjectType)()
], Device);
exports.Device = Device;


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlaybackState = void 0;
const graphql_1 = __webpack_require__(8);
const _1 = __webpack_require__(27);
const spotify_1 = __webpack_require__(34);
let PlaybackState = class PlaybackState {
};
__decorate([
    (0, graphql_1.Field)(() => _1.Device),
    __metadata("design:type", typeof (_a = typeof _1.Device !== "undefined" && _1.Device) === "function" ? _a : Object)
], PlaybackState.prototype, "device", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_b = typeof spotify_1.RepeatedState !== "undefined" && spotify_1.RepeatedState) === "function" ? _b : Object)
], PlaybackState.prototype, "repeatState", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_c = typeof spotify_1.ShuffleState !== "undefined" && spotify_1.ShuffleState) === "function" ? _c : Object)
], PlaybackState.prototype, "shuffleState", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], PlaybackState.prototype, "isPlaying", void 0);
__decorate([
    (0, graphql_1.Field)(() => _1.Track),
    __metadata("design:type", typeof (_d = typeof _1.Track !== "undefined" && _1.Track) === "function" ? _d : Object)
], PlaybackState.prototype, "track", void 0);
PlaybackState = __decorate([
    (0, graphql_1.ObjectType)()
], PlaybackState);
exports.PlaybackState = PlaybackState;


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(35), exports);
__exportStar(__webpack_require__(36), exports);
__exportStar(__webpack_require__(37), exports);
__exportStar(__webpack_require__(38), exports);
__exportStar(__webpack_require__(39), exports);
__exportStar(__webpack_require__(40), exports);
__exportStar(__webpack_require__(41), exports);
__exportStar(__webpack_require__(42), exports);
__exportStar(__webpack_require__(43), exports);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShuffleState = exports.RepeatedState = void 0;
var RepeatedState;
(function (RepeatedState) {
    RepeatedState["TRACK"] = "track";
    RepeatedState["CONTEXT"] = "context";
    RepeatedState["OFF"] = "off";
})(RepeatedState = exports.RepeatedState || (exports.RepeatedState = {}));
var ShuffleState;
(function (ShuffleState) {
    ShuffleState["ON"] = "on";
    ShuffleState["OFF"] = "off";
})(ShuffleState = exports.ShuffleState || (exports.ShuffleState = {}));


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Genres = void 0;
const graphql_1 = __webpack_require__(8);
let Genres = class Genres {
};
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], Genres.prototype, "genres", void 0);
Genres = __decorate([
    (0, graphql_1.ObjectType)()
], Genres);
exports.Genres = Genres;


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Success = void 0;
const graphql_1 = __webpack_require__(8);
let Success = class Success {
};
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], Success.prototype, "success", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Success.prototype, "message", void 0);
Success = __decorate([
    (0, graphql_1.ObjectType)()
], Success);
exports.Success = Success;


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SecretData = void 0;
const graphql_1 = __webpack_require__(8);
let SecretData = class SecretData {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], SecretData.prototype, "accessToken", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], SecretData.prototype, "refreshToken", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], SecretData.prototype, "expiresIn", void 0);
SecretData = __decorate([
    (0, graphql_1.ObjectType)()
], SecretData);
exports.SecretData = SecretData;


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(48), exports);
__exportStar(__webpack_require__(49), exports);
__exportStar(__webpack_require__(50), exports);


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthResolver = void 0;
const config_1 = __webpack_require__(2);
const graphql_1 = __webpack_require__(8);
const rxjs_1 = __webpack_require__(52);
const auth_service_1 = __webpack_require__(53);
const dtos_1 = __webpack_require__(25);
const decorators_1 = __webpack_require__(22);
let AuthResolver = class AuthResolver {
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    async refresh(refreshToken) {
        return await (0, rxjs_1.firstValueFrom)(this.authService.token({ refreshToken }));
    }
    async profile(accessToken) {
        return await (0, rxjs_1.firstValueFrom)(this.authService.profile(accessToken));
    }
};
__decorate([
    (0, graphql_1.Query)(() => dtos_1.SecretData),
    __param(0, (0, decorators_1.RefreshToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "refresh", null);
__decorate([
    (0, graphql_1.Query)(() => dtos_1.ProfileDto),
    __param(0, (0, decorators_1.AccessToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "profile", null);
AuthResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], AuthResolver);
exports.AuthResolver = AuthResolver;


/***/ }),
/* 52 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const axios_1 = __webpack_require__(54);
const common_1 = __webpack_require__(6);
const config_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(55);
const rxjs_1 = __webpack_require__(52);
const adapter_1 = __webpack_require__(10);
const config_2 = __webpack_require__(56);
const utils_1 = __webpack_require__(13);
let AuthService = class AuthService {
    constructor(jwtService, httpService, configService, adapterService) {
        this.jwtService = jwtService;
        this.httpService = httpService;
        this.configService = configService;
        this.adapterService = adapterService;
    }
    login({ id, username }) {
        const payload = {
            name: username,
            sub: id,
        };
        return this.jwtService.sign(payload);
    }
    token({ refreshToken, code }) {
        const url = `${this.configService.get(config_2.Environment.SPOTIFY_ACCOUNTS_URL)}/api/token`;
        const cliendId = this.configService.get(config_2.Environment.SPOTIFY_CLIENT_ID);
        const clientSecret = this.configService.get(config_2.Environment.SPOTIFY_CLIENT_SECRET);
        const bufferedCredentials = Buffer.from(`${cliendId}:${clientSecret}`).toString('base64');
        const parameters = new URLSearchParams();
        if (refreshToken) {
            parameters.append('refresh_token', refreshToken);
            parameters.append('grant_type', 'refresh_token');
        }
        if (code) {
            parameters.append('code', code);
            parameters.append('grant_type', 'authorization_code');
            parameters.append('redirect_uri', this.configService.get(config_2.Environment.SPOTIFY_CALLBACK_URL));
        }
        return this.httpService
            .post(url, parameters, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${bufferedCredentials}`,
            },
        })
            .pipe((0, rxjs_1.map)(response => response.data), (0, rxjs_1.map)(({ access_token, refresh_token, expires_in }) => ({
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
        })), (0, rxjs_1.catchError)(utils_1.catchSpotifyError));
    }
    profile(accessToken) {
        return this.httpService
            .get('/me', (0, utils_1.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data), (0, rxjs_1.map)(this.adapterService.adaptProfile), (0, rxjs_1.catchError)(utils_1.catchSpotifyError));
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object, typeof (_d = typeof adapter_1.AdapterService !== "undefined" && adapter_1.AdapterService) === "function" ? _d : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),
/* 54 */
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),
/* 55 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(57), exports);


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Environment = void 0;
var Environment;
(function (Environment) {
    Environment["PORT"] = "PORT";
    Environment["SPOTIFY_CLIENT_ID"] = "SPOTIFY_CLIENT_ID";
    Environment["SPOTIFY_CLIENT_SECRET"] = "SPOTIFY_CLIENT_SECRET";
    Environment["SPOTIFY_CALLBACK_URL"] = "SPOTIFY_CALLBACK_URL";
    Environment["SPOTIFY_BASE_URL"] = "SPOTIFY_BASE_URL";
    Environment["SPOTIFY_ACCOUNTS_URL"] = "SPOTIFY_ACCOUNTS_URL";
    Environment["CLIENT_CALLBACK_URL"] = "CLIENT_CALLBACK_URL";
    Environment["JWT_SECRET"] = "JWT_SECRET";
    Environment["NODE_ENV"] = "NODE_ENV";
})(Environment = exports.Environment || (exports.Environment = {}));


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(6);
const config_1 = __webpack_require__(2);
const rxjs_1 = __webpack_require__(52);
const auth_service_1 = __webpack_require__(53);
const config_2 = __webpack_require__(20);
const types_1 = __webpack_require__(47);
const config_3 = __webpack_require__(56);
const { SPOTIFY_CALLBACK_URL, SPOTIFY_CLIENT_ID, SPOTIFY_ACCOUNTS_URL, CLIENT_CALLBACK_URL, } = config_3.Environment;
let AuthController = class AuthController {
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    login() {
        return {
            url: `${this.configService.get(SPOTIFY_ACCOUNTS_URL)}/authorize?${new URLSearchParams({
                client_id: this.configService.get(SPOTIFY_CLIENT_ID),
                response_type: 'code',
                redirect_uri: this.configService.get(SPOTIFY_CALLBACK_URL),
                scope: config_2.spotifyAuthorizationScopes.join(' '),
            })}`,
            statusCode: common_1.HttpStatus.PERMANENT_REDIRECT,
        };
    }
    async callback(code) {
        const { accessToken, refreshToken } = await (0, rxjs_1.firstValueFrom)(this.authService.token({ code }));
        return {
            url: `${this.configService.get(CLIENT_CALLBACK_URL)}/api/authorize?${new URLSearchParams({
                accessToken,
                refreshToken,
            })}`,
            statusCode: common_1.HttpStatus.PERMANENT_REDIRECT,
        };
    }
};
__decorate([
    (0, common_1.Get)('login'),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_c = typeof types_1.RedirectResponse !== "undefined" && types_1.RedirectResponse) === "function" ? _c : Object)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('callback'),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], AuthController.prototype, "callback", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], AuthController);
exports.AuthController = AuthController;


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(6);
const config_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(55);
const axios_1 = __webpack_require__(54);
const auth_service_1 = __webpack_require__(53);
const auth_resolver_1 = __webpack_require__(51);
const auth_controller_1 = __webpack_require__(58);
const adapter_1 = __webpack_require__(10);
const config_2 = __webpack_require__(56);
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.registerAsync({
                useFactory: (configService) => ({
                    baseURL: configService.get(config_2.Environment.SPOTIFY_BASE_URL),
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            jwt_1.JwtModule.registerAsync({
                useFactory: async (configService) => {
                    return {
                        secret: configService.get(config_2.Environment.JWT_SECRET),
                        signOptions: {
                            expiresIn: '3600s',
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            adapter_1.AdapterModule,
        ],
        providers: [auth_service_1.AuthService, auth_resolver_1.AuthResolver],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(61), exports);
__exportStar(__webpack_require__(65), exports);
__exportStar(__webpack_require__(67), exports);
__exportStar(__webpack_require__(66), exports);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(62), exports);
__exportStar(__webpack_require__(64), exports);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LimitArguments = void 0;
const graphql_1 = __webpack_require__(8);
const class_validator_1 = __webpack_require__(63);
let LimitArguments = class LimitArguments {
};
__decorate([
    (0, graphql_1.Field)(() => Number, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], LimitArguments.prototype, "limit", void 0);
LimitArguments = __decorate([
    (0, graphql_1.ArgsType)()
], LimitArguments);
exports.LimitArguments = LimitArguments;


/***/ }),
/* 63 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IdArguments = void 0;
const graphql_1 = __webpack_require__(8);
const class_validator_1 = __webpack_require__(63);
let IdArguments = class IdArguments {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IdArguments.prototype, "id", void 0);
IdArguments = __decorate([
    (0, graphql_1.ArgsType)()
], IdArguments);
exports.IdArguments = IdArguments;


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatisticsModule = void 0;
const common_1 = __webpack_require__(6);
const axios_1 = __webpack_require__(54);
const config_1 = __webpack_require__(2);
const statistics_service_1 = __webpack_require__(66);
const statistics_resolver_1 = __webpack_require__(67);
const adapter_1 = __webpack_require__(10);
const auth_1 = __webpack_require__(19);
const config_2 = __webpack_require__(56);
let StatisticsModule = class StatisticsModule {
};
StatisticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.registerAsync({
                useFactory: (configService) => ({
                    baseURL: configService.get(config_2.Environment.SPOTIFY_BASE_URL),
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            adapter_1.AdapterModule,
            auth_1.AuthModule,
        ],
        providers: [statistics_service_1.StatisticsService, statistics_resolver_1.StatisticsResolver],
    })
], StatisticsModule);
exports.StatisticsModule = StatisticsModule;


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatisticsService = void 0;
const axios_1 = __webpack_require__(54);
const common_1 = __webpack_require__(6);
const rxjs_1 = __webpack_require__(52);
const adapter_1 = __webpack_require__(10);
const utils_1 = __webpack_require__(13);
let StatisticsService = class StatisticsService {
    constructor(httpService, adapterService) {
        this.httpService = httpService;
        this.adapterService = adapterService;
    }
    getHello() {
        return 'Hello World!';
    }
    lastTracks(accessToken, limit = 20) {
        return this.httpService
            .get(`/me/player/recently-played?limit=${limit}`, (0, utils_1.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.items), (0, rxjs_1.map)(items => items.map(({ track, played_at }) => (Object.assign(Object.assign({}, track), { played_at })))), (0, rxjs_1.map)(this.adapterService.adaptTracks), (0, rxjs_1.catchError)(utils_1.catchSpotifyError));
    }
    topGenres(accessToken, limit = 10) {
        return this.httpService
            .get(`/me/top/artists?limit=${50}&time_range=long_term`, (0, utils_1.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.items), (0, rxjs_1.map)(items => this.adapterService.adaptGenres(items, limit)), (0, rxjs_1.catchError)(utils_1.catchSpotifyError));
    }
    topArtists(accessToken, limit = 10) {
        return this.httpService
            .get(`/me/top/artists?limit=${limit}&time_range=long_term`, (0, utils_1.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.items), (0, rxjs_1.map)(this.adapterService.adaptArtists), (0, rxjs_1.catchError)(utils_1.catchSpotifyError));
    }
    topTracks(accessToken, limit = 10) {
        return this.httpService
            .get(`/me/top/tracks?limit=${limit}&time_range=long_term`, (0, utils_1.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.items), (0, rxjs_1.map)(this.adapterService.adaptTracks), (0, rxjs_1.catchError)(utils_1.catchSpotifyError));
    }
    artist(accessToken, id) {
        return this.httpService
            .get(`/artists/${id}`, (0, utils_1.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data), (0, rxjs_1.map)(this.adapterService.adaptArtist), (0, rxjs_1.catchError)(utils_1.catchSpotifyError));
    }
};
StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object, typeof (_b = typeof adapter_1.AdapterService !== "undefined" && adapter_1.AdapterService) === "function" ? _b : Object])
], StatisticsService);
exports.StatisticsService = StatisticsService;


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatisticsResolver = void 0;
const graphql_1 = __webpack_require__(8);
const rxjs_1 = __webpack_require__(52);
const statistics_service_1 = __webpack_require__(66);
const dtos_1 = __webpack_require__(61);
const auth_1 = __webpack_require__(19);
const dtos_2 = __webpack_require__(27);
let StatisticsResolver = class StatisticsResolver {
    constructor(statisticsService) {
        this.statisticsService = statisticsService;
    }
    async lastTracks(accessToken, { limit }) {
        return await (0, rxjs_1.firstValueFrom)(this.statisticsService.lastTracks(accessToken, limit));
    }
    async topTracks(accessToken, { limit }) {
        return await (0, rxjs_1.firstValueFrom)(this.statisticsService.topTracks(accessToken, limit));
    }
    async topGenres(accessToken, { limit }) {
        return await (0, rxjs_1.firstValueFrom)(this.statisticsService.topGenres(accessToken, limit));
    }
    async topArtists(accessToken, { limit }) {
        return await (0, rxjs_1.firstValueFrom)(this.statisticsService.topArtists(accessToken, limit));
    }
    async artist(accessToken, { id }) {
        return await (0, rxjs_1.firstValueFrom)(this.statisticsService.artist(accessToken, id));
    }
};
__decorate([
    (0, graphql_1.Query)(() => [dtos_2.Track]),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof dtos_1.LimitArguments !== "undefined" && dtos_1.LimitArguments) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], StatisticsResolver.prototype, "lastTracks", null);
__decorate([
    (0, graphql_1.Query)(() => [dtos_2.Track]),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof dtos_1.LimitArguments !== "undefined" && dtos_1.LimitArguments) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], StatisticsResolver.prototype, "topTracks", null);
__decorate([
    (0, graphql_1.Query)(() => dtos_2.Genres),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof dtos_1.LimitArguments !== "undefined" && dtos_1.LimitArguments) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], StatisticsResolver.prototype, "topGenres", null);
__decorate([
    (0, graphql_1.Query)(() => [dtos_2.Artist]),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof dtos_1.LimitArguments !== "undefined" && dtos_1.LimitArguments) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], StatisticsResolver.prototype, "topArtists", null);
__decorate([
    (0, graphql_1.Query)(() => dtos_2.Artist),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof dtos_1.IdArguments !== "undefined" && dtos_1.IdArguments) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], StatisticsResolver.prototype, "artist", null);
StatisticsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof statistics_service_1.StatisticsService !== "undefined" && statistics_service_1.StatisticsService) === "function" ? _a : Object])
], StatisticsResolver);
exports.StatisticsResolver = StatisticsResolver;


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(69), exports);
__exportStar(__webpack_require__(70), exports);
__exportStar(__webpack_require__(72), exports);
__exportStar(__webpack_require__(71), exports);


/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerMessage = void 0;
var PlayerMessage;
(function (PlayerMessage) {
    PlayerMessage["NO_AVAIBLE_DEVICES"] = "No device is avaible";
    PlayerMessage["NO_PLAYING_DEVICE"] = "No device is currently playing";
    PlayerMessage["DEVICE_ALREADY_PLAYING"] = "Device is already playing";
})(PlayerMessage = exports.PlayerMessage || (exports.PlayerMessage = {}));


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerModule = void 0;
const common_1 = __webpack_require__(6);
const axios_1 = __webpack_require__(54);
const config_1 = __webpack_require__(2);
const player_service_1 = __webpack_require__(71);
const player_resolver_1 = __webpack_require__(72);
const adapter_1 = __webpack_require__(10);
const config_2 = __webpack_require__(56);
let PlayerModule = class PlayerModule {
};
PlayerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.registerAsync({
                useFactory: (configService) => ({
                    baseURL: configService.get(config_2.Environment.SPOTIFY_BASE_URL),
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            adapter_1.AdapterModule,
        ],
        providers: [player_service_1.PlayerService, player_resolver_1.PlayerResolver],
    })
], PlayerModule);
exports.PlayerModule = PlayerModule;


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerService = void 0;
const axios_1 = __webpack_require__(54);
const common_1 = __webpack_require__(6);
const rxjs_1 = __webpack_require__(52);
const adapter_1 = __webpack_require__(10);
const messages_1 = __webpack_require__(69);
const utils_1 = __webpack_require__(13);
let PlayerService = class PlayerService {
    constructor(httpService, adapterService) {
        this.httpService = httpService;
        this.adapterService = adapterService;
    }
    avaibleDevices(accessToken) {
        return this.httpService
            .get('/me/player/devices', (0, utils_1.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.devices), (0, rxjs_1.catchError)(utils_1.catchSpotifyError), (0, rxjs_1.tap)(devices => {
            if (devices.length <= 0)
                throw new common_1.ForbiddenException(messages_1.PlayerMessage.NO_AVAIBLE_DEVICES);
        }), (0, rxjs_1.map)(this.adapterService.adaptDevices));
    }
    currentPlaybackState(accessToken) {
        return this.httpService
            .get('/me/player', (0, utils_1.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data), (0, rxjs_1.catchError)(utils_1.catchSpotifyError), (0, rxjs_1.tap)(playbackState => {
            if (!playbackState.device)
                throw new common_1.ForbiddenException(messages_1.PlayerMessage.NO_PLAYING_DEVICE);
        }), (0, rxjs_1.map)(this.adapterService.adaptPlaybackState));
    }
    pausePlayer(accessToken, afterTime = 0, deviceId) {
        const deviceIdQuery = `?device_id=${deviceId}`;
        return (0, rxjs_1.timer)(afterTime).pipe((0, rxjs_1.exhaustMap)(() => {
            return this.httpService
                .put(`/me/player/pause${deviceId ? deviceIdQuery : ''}`, {}, (0, utils_1.applyAuthorizationHeader)(accessToken))
                .pipe((0, rxjs_1.map)(() => ({
                success: true,
            })), (0, rxjs_1.catchError)(error => {
                if (error.response.data.error.status === 403)
                    throw new common_1.ForbiddenException(messages_1.PlayerMessage.NO_PLAYING_DEVICE);
                return (0, utils_1.catchSpotifyError)(error);
            }));
        }));
    }
    resumePlayer(accessToken, deviceId) {
        const deviceIdQuery = `?device_id=${deviceId}`;
        return this.httpService
            .put(`/me/player/play${deviceId ? deviceIdQuery : ''}`, {}, (0, utils_1.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(() => ({
            success: true,
        })), (0, rxjs_1.catchError)(error => {
            if (error.response.data.error.status === 403)
                throw new common_1.ForbiddenException(messages_1.PlayerMessage.DEVICE_ALREADY_PLAYING);
            return (0, utils_1.catchSpotifyError)(error);
        }));
    }
};
PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object, typeof (_b = typeof adapter_1.AdapterService !== "undefined" && adapter_1.AdapterService) === "function" ? _b : Object])
], PlayerService);
exports.PlayerService = PlayerService;


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerResolver = void 0;
const graphql_1 = __webpack_require__(8);
const rxjs_1 = __webpack_require__(52);
const player_service_1 = __webpack_require__(71);
const auth_1 = __webpack_require__(19);
const dtos_1 = __webpack_require__(27);
let PlayerResolver = class PlayerResolver {
    constructor(playerService) {
        this.playerService = playerService;
    }
    async avaibleDevices(accessToken) {
        return await (0, rxjs_1.firstValueFrom)(this.playerService.avaibleDevices(accessToken));
    }
    async currentPlaybackState(accessToken) {
        return await (0, rxjs_1.firstValueFrom)(this.playerService.currentPlaybackState(accessToken));
    }
    async pausePlayer(accessToken, afterTime, deviceId) {
        return await (0, rxjs_1.firstValueFrom)(this.playerService.pausePlayer(accessToken, afterTime, deviceId));
    }
    async resumePlayer(accessToken, deviceId) {
        return await (0, rxjs_1.firstValueFrom)(this.playerService.resumePlayer(accessToken, deviceId));
    }
};
__decorate([
    (0, graphql_1.Query)(() => [dtos_1.Device]),
    __param(0, (0, auth_1.AccessToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlayerResolver.prototype, "avaibleDevices", null);
__decorate([
    (0, graphql_1.Query)(() => dtos_1.PlaybackState),
    __param(0, (0, auth_1.AccessToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlayerResolver.prototype, "currentPlaybackState", null);
__decorate([
    (0, graphql_1.Query)(() => dtos_1.Success),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, graphql_1.Args)('afterTime', { nullable: true })),
    __param(2, (0, graphql_1.Args)('deviceId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], PlayerResolver.prototype, "pausePlayer", null);
__decorate([
    (0, graphql_1.Query)(() => dtos_1.Success),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, graphql_1.Args)('deviceId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PlayerResolver.prototype, "resumePlayer", null);
PlayerResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof player_service_1.PlayerService !== "undefined" && player_service_1.PlayerService) === "function" ? _a : Object])
], PlayerResolver);
exports.PlayerResolver = PlayerResolver;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const cookieParser = __webpack_require__(3);
const app_1 = __webpack_require__(4);
const config_2 = __webpack_require__(56);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: configService.get(config_2.Environment.CLIENT_CALLBACK_URL),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.use(cookieParser());
    await app.startAllMicroservices();
    await app.listen(+configService.get(config_2.Environment.PORT) || 4000);
}
bootstrap();

})();

/******/ })()
;