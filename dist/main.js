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
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 5 */
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
__exportStar(__webpack_require__(6), exports);


/***/ }),
/* 6 */
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
/* 7 */
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
__exportStar(__webpack_require__(8), exports);


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(9);
const apollo_1 = __webpack_require__(10);
const graphql_1 = __webpack_require__(11);
const Joi = __webpack_require__(12);
const config_1 = __webpack_require__(2);
const adapter_1 = __webpack_require__(13);
const auth_1 = __webpack_require__(22);
const statistics_1 = __webpack_require__(66);
const player_1 = __webpack_require__(78);
const config_2 = __webpack_require__(5);
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
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/apollo");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/graphql");

/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("joi");

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


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdapterModule = void 0;
const common_1 = __webpack_require__(9);
const adapter_service_1 = __webpack_require__(15);
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
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdapterService = void 0;
const common_1 = __webpack_require__(9);
const utils_1 = __webpack_require__(16);
let AdapterService = class AdapterService {
    constructor() {
        this.adaptArtist = ({ id, name, genres, external_urls: { spotify: href }, images, }) => ({
            id,
            name,
            genres,
            href,
            images,
        });
        this.adaptArtists = (artists) => artists.map(artist => this.adaptArtist(artist));
        this.adaptGenres = (artists, limit) => ({
            genres: (0, utils_1.getMostFrequentItems)(artists.flatMap(({ genres }) => genres), limit),
        });
        this.adaptTrack = ({ id, name, album, artists, external_urls: { spotify: href }, duration_ms, progress_ms, played_at, }) => (Object.assign(Object.assign({ id,
            name, album: { name: album.name, images: album.images }, artists: artists.map(({ name, id, href }) => ({ name, id, href })), href, duration: duration_ms }, (progress_ms && { progress: progress_ms })), (played_at && { playedAt: played_at })));
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
        this.adaptAudioFeatures = ({ id, track_href, danceability, acousticness, instrumentalness, speechiness, liveness, loudness, energy, tempo, mode, key, valence, }) => ({
            id,
            trackHref: track_href,
            danceability,
            acousticness,
            instrumentalness,
            speechiness,
            liveness,
            loudness,
            energy,
            tempo,
            mode,
            key,
            valence,
        });
    }
};
AdapterService = __decorate([
    (0, common_1.Injectable)()
], AdapterService);
exports.AdapterService = AdapterService;


/***/ }),
/* 16 */
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
__exportStar(__webpack_require__(17), exports);
__exportStar(__webpack_require__(18), exports);
__exportStar(__webpack_require__(19), exports);
__exportStar(__webpack_require__(21), exports);


/***/ }),
/* 17 */
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
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.catchSpotifyError = void 0;
const common_1 = __webpack_require__(9);
const catchSpotifyError = error => {
    var _a;
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
/* 19 */
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
const constants_1 = __webpack_require__(20);
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
/* 20 */
/***/ ((module) => {

module.exports = require("@nestjs/common/constants");

/***/ }),
/* 21 */
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
__exportStar(__webpack_require__(25), exports);
__exportStar(__webpack_require__(29), exports);
__exportStar(__webpack_require__(53), exports);
__exportStar(__webpack_require__(57), exports);
__exportStar(__webpack_require__(59), exports);
__exportStar(__webpack_require__(61), exports);
__exportStar(__webpack_require__(64), exports);
__exportStar(__webpack_require__(65), exports);


/***/ }),
/* 23 */
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
__exportStar(__webpack_require__(24), exports);


/***/ }),
/* 24 */
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
__exportStar(__webpack_require__(27), exports);
__exportStar(__webpack_require__(28), exports);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshToken = void 0;
const common_1 = __webpack_require__(9);
const graphql_1 = __webpack_require__(11);
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
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccessToken = void 0;
const common_1 = __webpack_require__(9);
const graphql_1 = __webpack_require__(11);
exports.AccessToken = (0, common_1.createParamDecorator)((data, context) => {
    var _a, _b;
    const request = context.getType() === 'http'
        ? context.switchToHttp().getRequest()
        : graphql_1.GqlExecutionContext.create(context).getContext().req;
    const accessToken = (_b = (_a = request.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.slice(7);
    if (!accessToken)
        throw new common_1.UnauthorizedException('No value was provided for Authentication');
    return accessToken;
});


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiAuth = void 0;
const common_1 = __webpack_require__(9);
const swagger_1 = __webpack_require__(4);
const ApiAuth = (authenticationType) => (0, common_1.applyDecorators)((0, swagger_1.ApiUnauthorizedResponse)({
    description: 'The access token expired',
}), (0, swagger_1.ApiUnauthorizedResponse)({
    description: 'Invalid access token',
}), (0, swagger_1.ApiUnauthorizedResponse)({
    description: 'No value was provided for Authentication',
}), (0, swagger_1.ApiBearerAuth)(authenticationType));
exports.ApiAuth = ApiAuth;


/***/ }),
/* 29 */
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
__exportStar(__webpack_require__(30), exports);
__exportStar(__webpack_require__(52), exports);


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
exports.ProfileDto = void 0;
const graphql_1 = __webpack_require__(11);
const swagger_1 = __webpack_require__(4);
const dtos_1 = __webpack_require__(31);
let ProfileDto = class ProfileDto {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileDto.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileDto.prototype, "displayName", void 0);
__decorate([
    (0, graphql_1.Field)(() => [dtos_1.ImageDto]),
    (0, swagger_1.ApiProperty)({ type: [dtos_1.ImageDto] }),
    __metadata("design:type", Array)
], ProfileDto.prototype, "images", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ProfileDto.prototype, "followers", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ProfileDto.prototype, "country", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ProfileDto.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileDto.prototype, "href", void 0);
ProfileDto = __decorate([
    (0, graphql_1.ObjectType)()
], ProfileDto);
exports.ProfileDto = ProfileDto;


/***/ }),
/* 31 */
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
__exportStar(__webpack_require__(32), exports);
__exportStar(__webpack_require__(33), exports);
__exportStar(__webpack_require__(34), exports);
__exportStar(__webpack_require__(35), exports);
__exportStar(__webpack_require__(36), exports);
__exportStar(__webpack_require__(37), exports);
__exportStar(__webpack_require__(49), exports);
__exportStar(__webpack_require__(50), exports);
__exportStar(__webpack_require__(51), exports);


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
exports.ImageDto = void 0;
const graphql_1 = __webpack_require__(11);
const swagger_1 = __webpack_require__(4);
let ImageDto = class ImageDto {
};
__decorate([
    (0, graphql_1.Field)(() => Number),
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ImageDto.prototype, "height", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ImageDto.prototype, "width", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ImageDto.prototype, "url", void 0);
ImageDto = __decorate([
    (0, graphql_1.ObjectType)()
], ImageDto);
exports.ImageDto = ImageDto;


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Album = void 0;
const graphql_1 = __webpack_require__(11);
const swagger_1 = __webpack_require__(4);
const _1 = __webpack_require__(31);
let Album = class Album {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Album.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Album.prototype, "artist", void 0);
__decorate([
    (0, graphql_1.Field)(() => [_1.ImageDto]),
    (0, swagger_1.ApiProperty)({ type: [_1.ImageDto] }),
    __metadata("design:type", Array)
], Album.prototype, "images", void 0);
Album = __decorate([
    (0, graphql_1.ObjectType)()
], Album);
exports.Album = Album;


/***/ }),
/* 34 */
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
const graphql_1 = __webpack_require__(11);
const swagger_1 = __webpack_require__(4);
const _1 = __webpack_require__(31);
let Artist = class Artist {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Artist.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Artist.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], Artist.prototype, "genres", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Artist.prototype, "href", void 0);
__decorate([
    (0, graphql_1.Field)(() => [_1.ImageDto]),
    (0, swagger_1.ApiProperty)({ type: [_1.ImageDto] }),
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
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TrackArtist.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TrackArtist.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TrackArtist.prototype, "href", void 0);
TrackArtist = __decorate([
    (0, graphql_1.ObjectType)()
], TrackArtist);
exports.TrackArtist = TrackArtist;


/***/ }),
/* 35 */
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
const graphql_1 = __webpack_require__(11);
const swagger_1 = __webpack_require__(4);
const _1 = __webpack_require__(31);
let Track = class Track {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Track.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Track.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Track.prototype, "href", void 0);
__decorate([
    (0, graphql_1.Field)(() => [_1.TrackArtist]),
    (0, swagger_1.ApiProperty)({ type: [_1.TrackArtist] }),
    __metadata("design:type", Array)
], Track.prototype, "artists", void 0);
__decorate([
    (0, graphql_1.Field)(() => _1.Album),
    (0, swagger_1.ApiProperty)({ type: _1.Album }),
    __metadata("design:type", typeof (_a = typeof _1.Album !== "undefined" && _1.Album) === "function" ? _a : Object)
], Track.prototype, "album", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Track.prototype, "duration", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number, { nullable: true }),
    (0, swagger_1.ApiProperty)({ type: Number, required: false }),
    __metadata("design:type", Number)
], Track.prototype, "progress", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], Track.prototype, "playedAt", void 0);
Track = __decorate([
    (0, graphql_1.ObjectType)()
], Track);
exports.Track = Track;


/***/ }),
/* 36 */
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
const graphql_1 = __webpack_require__(11);
const swagger_1 = __webpack_require__(4);
let Device = class Device {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Device.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Device.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Device.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], Device.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], Device.prototype, "isPrivateSession", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], Device.prototype, "isRestricted", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Device.prototype, "volumePercent", void 0);
Device = __decorate([
    (0, graphql_1.ObjectType)()
], Device);
exports.Device = Device;


/***/ }),
/* 37 */
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
const graphql_1 = __webpack_require__(11);
const swagger_1 = __webpack_require__(4);
const _1 = __webpack_require__(31);
const spotify_1 = __webpack_require__(38);
let PlaybackState = class PlaybackState {
};
__decorate([
    (0, graphql_1.Field)(() => _1.Device),
    (0, swagger_1.ApiProperty)({ type: _1.Device }),
    __metadata("design:type", typeof (_a = typeof _1.Device !== "undefined" && _1.Device) === "function" ? _a : Object)
], PlaybackState.prototype, "device", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", typeof (_b = typeof spotify_1.RepeatedState !== "undefined" && spotify_1.RepeatedState) === "function" ? _b : Object)
], PlaybackState.prototype, "repeatState", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", typeof (_c = typeof spotify_1.ShuffleState !== "undefined" && spotify_1.ShuffleState) === "function" ? _c : Object)
], PlaybackState.prototype, "shuffleState", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], PlaybackState.prototype, "isPlaying", void 0);
__decorate([
    (0, graphql_1.Field)(() => _1.Track),
    (0, swagger_1.ApiProperty)({ type: _1.Track }),
    __metadata("design:type", typeof (_d = typeof _1.Track !== "undefined" && _1.Track) === "function" ? _d : Object)
], PlaybackState.prototype, "track", void 0);
PlaybackState = __decorate([
    (0, graphql_1.ObjectType)()
], PlaybackState);
exports.PlaybackState = PlaybackState;


/***/ }),
/* 38 */
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
__exportStar(__webpack_require__(39), exports);
__exportStar(__webpack_require__(40), exports);
__exportStar(__webpack_require__(41), exports);
__exportStar(__webpack_require__(42), exports);
__exportStar(__webpack_require__(43), exports);
__exportStar(__webpack_require__(44), exports);
__exportStar(__webpack_require__(45), exports);
__exportStar(__webpack_require__(46), exports);
__exportStar(__webpack_require__(47), exports);
__exportStar(__webpack_require__(48), exports);


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


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 47 */
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
/* 48 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 49 */
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
const graphql_1 = __webpack_require__(11);
const swagger_1 = __webpack_require__(4);
let Genres = class Genres {
};
__decorate([
    (0, graphql_1.Field)(() => [String]),
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], Genres.prototype, "genres", void 0);
Genres = __decorate([
    (0, graphql_1.ObjectType)()
], Genres);
exports.Genres = Genres;


/***/ }),
/* 50 */
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
const graphql_1 = __webpack_require__(11);
const swagger_1 = __webpack_require__(4);
let Success = class Success {
};
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], Success.prototype, "success", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], Success.prototype, "message", void 0);
Success = __decorate([
    (0, graphql_1.ObjectType)()
], Success);
exports.Success = Success;


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Analysis = void 0;
const swagger_1 = __webpack_require__(4);
class Analysis {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Analysis.prototype, "danceability", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Analysis.prototype, "acousticness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Analysis.prototype, "instrumentalness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Analysis.prototype, "speechiness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Analysis.prototype, "liveness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Analysis.prototype, "loudness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Analysis.prototype, "energy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Analysis.prototype, "tempo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Analysis.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Analysis.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Analysis.prototype, "valence", void 0);
exports.Analysis = Analysis;


/***/ }),
/* 52 */
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
const graphql_1 = __webpack_require__(11);
const swagger_1 = __webpack_require__(4);
let SecretData = class SecretData {
};
__decorate([
    (0, graphql_1.Field)(() => String),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecretData.prototype, "accessToken", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], SecretData.prototype, "refreshToken", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], SecretData.prototype, "expiresIn", void 0);
SecretData = __decorate([
    (0, graphql_1.ObjectType)()
], SecretData);
exports.SecretData = SecretData;


/***/ }),
/* 53 */
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
__exportStar(__webpack_require__(54), exports);
__exportStar(__webpack_require__(55), exports);
__exportStar(__webpack_require__(56), exports);


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 57 */
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
__exportStar(__webpack_require__(58), exports);


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthenticationType = void 0;
var AuthenticationType;
(function (AuthenticationType) {
    AuthenticationType["ACCESS_TOKEN"] = "access-token";
    AuthenticationType["REFRESH_TOKEN"] = "refresh-token";
})(AuthenticationType = exports.AuthenticationType || (exports.AuthenticationType = {}));


/***/ }),
/* 59 */
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
const graphql_1 = __webpack_require__(11);
const rxjs_1 = __webpack_require__(60);
const auth_service_1 = __webpack_require__(61);
const dtos_1 = __webpack_require__(29);
const decorators_1 = __webpack_require__(25);
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
/* 60 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 61 */
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
const axios_1 = __webpack_require__(62);
const common_1 = __webpack_require__(9);
const config_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(63);
const rxjs_1 = __webpack_require__(60);
const adapter_1 = __webpack_require__(13);
const config_2 = __webpack_require__(5);
const utils_1 = __webpack_require__(16);
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
/* 62 */
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),
/* 63 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(9);
const config_1 = __webpack_require__(2);
const rxjs_1 = __webpack_require__(60);
const swagger_1 = __webpack_require__(4);
const auth_service_1 = __webpack_require__(61);
const config_2 = __webpack_require__(23);
const types_1 = __webpack_require__(53);
const decorators_1 = __webpack_require__(25);
const dtos_1 = __webpack_require__(29);
const config_3 = __webpack_require__(5);
const enums_1 = __webpack_require__(57);
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
        console.log('acessToken', accessToken);
        console.log('refreshToken', refreshToken);
        return {
            url: `${this.configService.get(CLIENT_CALLBACK_URL)}/api/authorize?${new URLSearchParams({
                accessToken,
                refreshToken,
            })}`,
            statusCode: common_1.HttpStatus.PERMANENT_REDIRECT,
        };
    }
    refresh(refreshToken) {
        return (0, rxjs_1.firstValueFrom)(this.authService.token({ refreshToken }));
    }
    profile(accessToken) {
        return (0, rxjs_1.firstValueFrom)(this.authService.profile(accessToken));
    }
};
__decorate([
    (0, common_1.Get)('login'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.Redirect)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_c = typeof types_1.RedirectResponse !== "undefined" && types_1.RedirectResponse) === "function" ? _c : Object)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('callback'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Query)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], AuthController.prototype, "callback", null);
__decorate([
    (0, common_1.Get)('refresh'),
    (0, decorators_1.ApiAuth)(enums_1.AuthenticationType.REFRESH_TOKEN),
    (0, swagger_1.ApiOkResponse)({
        description: 'Access token has been succesfully refreshed',
        type: dtos_1.SecretData,
    }),
    __param(0, (0, decorators_1.AccessToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, decorators_1.ApiAuth)(enums_1.AuthenticationType.ACCESS_TOKEN),
    (0, swagger_1.ApiOkResponse)({
        description: "User's profile has been succesfully found",
        type: dtos_1.ProfileDto,
    }),
    __param(0, (0, decorators_1.AccessToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "profile", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], AuthController);
exports.AuthController = AuthController;


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
exports.AuthModule = void 0;
const common_1 = __webpack_require__(9);
const config_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(63);
const axios_1 = __webpack_require__(62);
const auth_service_1 = __webpack_require__(61);
const auth_resolver_1 = __webpack_require__(59);
const auth_controller_1 = __webpack_require__(64);
const adapter_1 = __webpack_require__(13);
const config_2 = __webpack_require__(5);
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
/* 66 */
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
__exportStar(__webpack_require__(67), exports);
__exportStar(__webpack_require__(71), exports);
__exportStar(__webpack_require__(76), exports);
__exportStar(__webpack_require__(72), exports);


/***/ }),
/* 67 */
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
__exportStar(__webpack_require__(68), exports);
__exportStar(__webpack_require__(70), exports);


/***/ }),
/* 68 */
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
const graphql_1 = __webpack_require__(11);
const class_validator_1 = __webpack_require__(69);
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
/* 69 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 70 */
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
const graphql_1 = __webpack_require__(11);
const class_validator_1 = __webpack_require__(69);
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
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatisticsModule = void 0;
const common_1 = __webpack_require__(9);
const axios_1 = __webpack_require__(62);
const config_1 = __webpack_require__(2);
const statistics_service_1 = __webpack_require__(72);
const statistics_resolver_1 = __webpack_require__(76);
const statistics_controller_1 = __webpack_require__(77);
const adapter_1 = __webpack_require__(13);
const auth_1 = __webpack_require__(22);
const config_2 = __webpack_require__(5);
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
        controllers: [statistics_controller_1.StatisticsController],
        providers: [statistics_service_1.StatisticsService, statistics_resolver_1.StatisticsResolver],
    })
], StatisticsModule);
exports.StatisticsModule = StatisticsModule;


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatisticsService = void 0;
const axios_1 = __webpack_require__(62);
const common_1 = __webpack_require__(9);
const rxjs_1 = __webpack_require__(60);
const utils_1 = __webpack_require__(73);
const adapter_1 = __webpack_require__(13);
const utils_2 = __webpack_require__(16);
let StatisticsService = class StatisticsService {
    constructor(httpService, adapterService) {
        this.httpService = httpService;
        this.adapterService = adapterService;
    }
    lastTracks(accessToken, limit = 20) {
        return this.httpService
            .get(`/me/player/recently-played?limit=${limit}`, (0, utils_2.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.items), (0, rxjs_1.map)(items => items.map(({ track, played_at }) => (Object.assign(Object.assign({}, track), { played_at })))), (0, rxjs_1.map)(this.adapterService.adaptTracks), (0, rxjs_1.catchError)(utils_2.catchSpotifyError));
    }
    topGenres(accessToken, limit = 10) {
        return this.httpService
            .get(`/me/top/artists?limit=${50}&time_range=long_term`, (0, utils_2.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.items), (0, rxjs_1.map)(items => this.adapterService.adaptGenres(items, limit)), (0, rxjs_1.catchError)(utils_2.catchSpotifyError));
    }
    topArtists(accessToken, limit = 10) {
        return this.httpService
            .get(`/me/top/artists?limit=${limit}&time_range=long_term`, (0, utils_2.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.items), (0, rxjs_1.map)(this.adapterService.adaptArtists), (0, rxjs_1.catchError)(utils_2.catchSpotifyError));
    }
    topTracks(accessToken, limit = 10) {
        return this.httpService
            .get(`/me/top/tracks?limit=${limit}&time_range=long_term`, (0, utils_2.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.items), (0, rxjs_1.map)(this.adapterService.adaptTracks), (0, rxjs_1.catchError)(utils_2.catchSpotifyError));
    }
    artist(accessToken, id) {
        return this.httpService
            .get(`/artists/${id}`, (0, utils_2.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data), (0, rxjs_1.map)(this.adapterService.adaptArtist), (0, rxjs_1.catchError)(utils_2.catchSpotifyError));
    }
    analysis(accessToken) {
        return this.topTracks(accessToken, 50).pipe((0, rxjs_1.mergeMap)(tracks => {
            const tracksIds = tracks.map(({ id }) => id).join(',');
            return this.httpService
                .get(`/audio-features?ids=${tracksIds}`, (0, utils_2.applyAuthorizationHeader)(accessToken))
                .pipe((0, rxjs_1.map)(response => response.data.audio_features), (0, rxjs_1.map)(audioFeatures => audioFeatures.map(audioFeature => this.adapterService.adaptAudioFeatures(audioFeature))), (0, rxjs_1.map)(utils_1.analysisFactory), (0, rxjs_1.catchError)(utils_2.catchSpotifyError));
        }));
    }
};
StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object, typeof (_b = typeof adapter_1.AdapterService !== "undefined" && adapter_1.AdapterService) === "function" ? _b : Object])
], StatisticsService);
exports.StatisticsService = StatisticsService;


/***/ }),
/* 73 */
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
__exportStar(__webpack_require__(74), exports);
__exportStar(__webpack_require__(75), exports);


/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.audioFeaturesReducer = void 0;
const audioFeaturesReducer = (accumulator, currentValue) => accumulator + currentValue;
exports.audioFeaturesReducer = audioFeaturesReducer;


/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.analysisFactory = void 0;
const audio_features_reducer_1 = __webpack_require__(74);
const analysisFactory = (audioFeatures) => ({
    danceability: audioFeatures
        .map(({ danceability }) => danceability)
        .reduce(audio_features_reducer_1.audioFeaturesReducer) / audioFeatures.length,
    acousticness: audioFeatures
        .map(({ acousticness }) => acousticness)
        .reduce(audio_features_reducer_1.audioFeaturesReducer) / audioFeatures.length,
    instrumentalness: audioFeatures
        .map(({ instrumentalness }) => instrumentalness)
        .reduce(audio_features_reducer_1.audioFeaturesReducer, 0) / audioFeatures.length,
    speechiness: audioFeatures
        .map(({ speechiness }) => speechiness)
        .reduce(audio_features_reducer_1.audioFeaturesReducer) / audioFeatures.length,
    liveness: audioFeatures.map(({ liveness }) => liveness).reduce(audio_features_reducer_1.audioFeaturesReducer) /
        audioFeatures.length,
    loudness: audioFeatures.map(({ loudness }) => loudness).reduce(audio_features_reducer_1.audioFeaturesReducer) /
        audioFeatures.length,
    energy: audioFeatures.map(({ energy }) => energy).reduce(audio_features_reducer_1.audioFeaturesReducer) /
        audioFeatures.length,
    tempo: audioFeatures.map(({ tempo }) => tempo).reduce(audio_features_reducer_1.audioFeaturesReducer) /
        audioFeatures.length,
    mode: audioFeatures.map(({ mode }) => mode).reduce(audio_features_reducer_1.audioFeaturesReducer) /
        audioFeatures.length,
    key: audioFeatures.map(({ key }) => key).reduce(audio_features_reducer_1.audioFeaturesReducer) /
        audioFeatures.length,
    valence: audioFeatures.map(({ valence }) => valence).reduce(audio_features_reducer_1.audioFeaturesReducer) /
        audioFeatures.length,
});
exports.analysisFactory = analysisFactory;


/***/ }),
/* 76 */
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
const graphql_1 = __webpack_require__(11);
const rxjs_1 = __webpack_require__(60);
const statistics_service_1 = __webpack_require__(72);
const dtos_1 = __webpack_require__(67);
const auth_1 = __webpack_require__(22);
const dtos_2 = __webpack_require__(31);
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
/* 77 */
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatisticsController = void 0;
const common_1 = __webpack_require__(9);
const swagger_1 = __webpack_require__(4);
const statistics_service_1 = __webpack_require__(72);
const dtos_1 = __webpack_require__(67);
const auth_1 = __webpack_require__(22);
const enums_1 = __webpack_require__(57);
const dtos_2 = __webpack_require__(31);
let StatisticsController = class StatisticsController {
    constructor(statisticsService) {
        this.statisticsService = statisticsService;
    }
    lastTracks(accessToken, { limit }) {
        return this.statisticsService.lastTracks(accessToken, limit);
    }
    topTracks(accessToken, { limit }) {
        return this.statisticsService.topTracks(accessToken, limit);
    }
    topGenres(accessToken, { limit }) {
        return this.statisticsService.topGenres(accessToken, limit);
    }
    topArtists(accessToken, { limit }) {
        return this.statisticsService.topArtists(accessToken, limit);
    }
    artist(accessToken, id) {
        return this.statisticsService.artist(accessToken, id);
    }
    analysis(accessToken) {
        return this.statisticsService.analysis(accessToken);
    }
};
__decorate([
    (0, common_1.Get)('/last-tracks'),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Last tracks has been succesfully found',
        type: [dtos_2.Track],
    }),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof dtos_1.LimitArguments !== "undefined" && dtos_1.LimitArguments) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "lastTracks", null);
__decorate([
    (0, common_1.Get)('/top-tracks'),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Top tracks has been succesfully found',
        type: [dtos_2.Track],
    }),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof dtos_1.LimitArguments !== "undefined" && dtos_1.LimitArguments) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "topTracks", null);
__decorate([
    (0, common_1.Get)('/top-genres'),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Top genres has been succesfully found',
        type: dtos_2.Genres,
    }),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof dtos_1.LimitArguments !== "undefined" && dtos_1.LimitArguments) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "topGenres", null);
__decorate([
    (0, common_1.Get)('/top-artists'),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Top artists has been succesfully found',
        type: [dtos_2.Artist],
    }),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof dtos_1.LimitArguments !== "undefined" && dtos_1.LimitArguments) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "topArtists", null);
__decorate([
    (0, common_1.Get)('/artist'),
    (0, swagger_1.ApiQuery)({ name: 'id', type: String, required: true }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Artist has been succesfully found',
        type: dtos_2.Artist,
    }),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "artist", null);
__decorate([
    (0, common_1.Get)('/analysis'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Analysis has been succesfully generated',
        type: dtos_2.Analysis,
    }),
    __param(0, (0, auth_1.AccessToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "analysis", null);
StatisticsController = __decorate([
    (0, common_1.Controller)('statistics'),
    (0, swagger_1.ApiTags)('statistics'),
    (0, auth_1.ApiAuth)(enums_1.AuthenticationType.ACCESS_TOKEN),
    __metadata("design:paramtypes", [typeof (_a = typeof statistics_service_1.StatisticsService !== "undefined" && statistics_service_1.StatisticsService) === "function" ? _a : Object])
], StatisticsController);
exports.StatisticsController = StatisticsController;


/***/ }),
/* 78 */
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
__exportStar(__webpack_require__(79), exports);
__exportStar(__webpack_require__(80), exports);
__exportStar(__webpack_require__(82), exports);
__exportStar(__webpack_require__(81), exports);


/***/ }),
/* 79 */
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
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerModule = void 0;
const common_1 = __webpack_require__(9);
const axios_1 = __webpack_require__(62);
const config_1 = __webpack_require__(2);
const player_service_1 = __webpack_require__(81);
const player_resolver_1 = __webpack_require__(82);
const player_controller_1 = __webpack_require__(83);
const adapter_1 = __webpack_require__(13);
const config_2 = __webpack_require__(5);
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
        controllers: [player_controller_1.PlayerController],
        providers: [player_service_1.PlayerService, player_resolver_1.PlayerResolver],
    })
], PlayerModule);
exports.PlayerModule = PlayerModule;


/***/ }),
/* 81 */
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
const axios_1 = __webpack_require__(62);
const common_1 = __webpack_require__(9);
const rxjs_1 = __webpack_require__(60);
const adapter_1 = __webpack_require__(13);
const messages_1 = __webpack_require__(79);
const utils_1 = __webpack_require__(16);
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
/* 82 */
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
const graphql_1 = __webpack_require__(11);
const rxjs_1 = __webpack_require__(60);
const player_service_1 = __webpack_require__(81);
const auth_1 = __webpack_require__(22);
const dtos_1 = __webpack_require__(31);
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


/***/ }),
/* 83 */
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
exports.PlayerController = void 0;
const common_1 = __webpack_require__(9);
const rxjs_1 = __webpack_require__(60);
const swagger_1 = __webpack_require__(4);
const player_service_1 = __webpack_require__(81);
const dtos_1 = __webpack_require__(31);
const auth_1 = __webpack_require__(22);
let PlayerController = class PlayerController {
    constructor(playerService) {
        this.playerService = playerService;
    }
    async availableDevices(accessToken) {
        return await (0, rxjs_1.firstValueFrom)(this.playerService.avaibleDevices(accessToken));
    }
    async currentPlaybackState(accessToken) {
        return await (0, rxjs_1.firstValueFrom)(this.playerService.currentPlaybackState(accessToken));
    }
    pausePlayer(accessToken, afterTime, deviceId) {
        return (0, rxjs_1.firstValueFrom)(this.playerService.pausePlayer(accessToken, afterTime, deviceId));
    }
    resumePlayer(accessToken, deviceId) {
        return (0, rxjs_1.firstValueFrom)(this.playerService.resumePlayer(accessToken, deviceId));
    }
};
__decorate([
    (0, common_1.Get)('/devices'),
    (0, swagger_1.ApiOkResponse)({
        type: dtos_1.Device,
        description: 'Available devices has been succesfully found',
    }),
    __param(0, (0, auth_1.AccessToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "availableDevices", null);
__decorate([
    (0, common_1.Get)('/state'),
    (0, swagger_1.ApiOkResponse)({
        type: dtos_1.PlaybackState,
        description: 'Current playback state has been succesfully found',
    }),
    __param(0, (0, auth_1.AccessToken)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "currentPlaybackState", null);
__decorate([
    (0, common_1.Put)('/pause'),
    (0, swagger_1.ApiQuery)({ name: 'afterTime', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'deviceId', type: String, required: false }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'No device is currently playing',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Player state has been succesfully paused',
        type: dtos_1.Success,
    }),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, common_1.Query)('afterTime')),
    __param(2, (0, common_1.Query)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", void 0)
], PlayerController.prototype, "pausePlayer", null);
__decorate([
    (0, common_1.Put)('/resume'),
    (0, swagger_1.ApiQuery)({ name: 'deviceId', type: String, required: false }),
    (0, swagger_1.ApiForbiddenResponse)({
        description: 'Device is already playing',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Player state has been succesfully resumed',
        type: dtos_1.Success,
    }),
    __param(0, (0, auth_1.AccessToken)()),
    __param(1, (0, common_1.Query)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PlayerController.prototype, "resumePlayer", null);
PlayerController = __decorate([
    (0, common_1.Controller)('player'),
    (0, swagger_1.ApiTags)('player'),
    (0, auth_1.ApiAuth)(auth_1.AuthenticationType.ACCESS_TOKEN),
    __metadata("design:paramtypes", [typeof (_a = typeof player_service_1.PlayerService !== "undefined" && player_service_1.PlayerService) === "function" ? _a : Object])
], PlayerController);
exports.PlayerController = PlayerController;


/***/ }),
/* 84 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BEARER = void 0;
exports.BEARER = 'bearer';


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
const swagger_1 = __webpack_require__(4);
const config_2 = __webpack_require__(5);
const app_1 = __webpack_require__(7);
const enums_1 = __webpack_require__(57);
const constants_1 = __webpack_require__(84);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const documentConfig = new swagger_1.DocumentBuilder()
        .setTitle('Rigtch Music API')
        .addBearerAuth({
        type: 'http',
        scheme: constants_1.BEARER,
        bearerFormat: 'JWT',
    }, enums_1.AuthenticationType.ACCESS_TOKEN)
        .addBearerAuth({
        type: 'http',
        scheme: constants_1.BEARER,
        bearerFormat: 'JWT',
    }, enums_1.AuthenticationType.REFRESH_TOKEN)
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, documentConfig);
    swagger_1.SwaggerModule.setup('api', app, document);
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