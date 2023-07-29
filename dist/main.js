/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common/adapters/artists.adapter.ts":
/*!************************************************!*\
  !*** ./src/common/adapters/artists.adapter.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.adaptArtists = exports.adaptArtist = void 0;
const adaptArtist = ({ id, name, genres, external_urls: { spotify: href }, images, }) => ({
    id,
    name,
    genres,
    href,
    images,
});
exports.adaptArtist = adaptArtist;
const adaptArtists = (artists) => artists.map(artist => (0, exports.adaptArtist)(artist));
exports.adaptArtists = adaptArtists;


/***/ }),

/***/ "./src/common/adapters/audio-features.adapter.ts":
/*!*******************************************************!*\
  !*** ./src/common/adapters/audio-features.adapter.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.adaptAudioFeatures = void 0;
const adaptAudioFeatures = ({ id, track_href, danceability, acousticness, instrumentalness, speechiness, liveness, loudness, energy, tempo, mode, key, valence, }) => ({
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
exports.adaptAudioFeatures = adaptAudioFeatures;


/***/ }),

/***/ "./src/common/adapters/devices.adapter.ts":
/*!************************************************!*\
  !*** ./src/common/adapters/devices.adapter.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.adaptDevices = void 0;
const adaptDevices = (devices) => devices.map(({ id, name, type, is_active: isActive, is_private_session: isPrivateSession, is_restricted: isRestricted, volume_percent: volumePercent, }) => ({
    id,
    name,
    type,
    isActive,
    isPrivateSession,
    isRestricted,
    volumePercent,
}));
exports.adaptDevices = adaptDevices;


/***/ }),

/***/ "./src/common/adapters/genres.adapter.ts":
/*!***********************************************!*\
  !*** ./src/common/adapters/genres.adapter.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.adaptGenres = void 0;
const utils_1 = __webpack_require__(/*! ~/utils */ "./src/utils/index.ts");
const adaptGenres = (artists, limit) => ({
    genres: (0, utils_1.getMostFrequentItems)(artists.flatMap(({ genres }) => genres), limit),
});
exports.adaptGenres = adaptGenres;


/***/ }),

/***/ "./src/common/adapters/index.ts":
/*!**************************************!*\
  !*** ./src/common/adapters/index.ts ***!
  \**************************************/
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
__exportStar(__webpack_require__(/*! ./artists.adapter */ "./src/common/adapters/artists.adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./devices.adapter */ "./src/common/adapters/devices.adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./genres.adapter */ "./src/common/adapters/genres.adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./playback-state.adapter */ "./src/common/adapters/playback-state.adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./tracks.adapter */ "./src/common/adapters/tracks.adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./profile.adapter */ "./src/common/adapters/profile.adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./audio-features.adapter */ "./src/common/adapters/audio-features.adapter.ts"), exports);
__exportStar(__webpack_require__(/*! ./secret-data.adapter */ "./src/common/adapters/secret-data.adapter.ts"), exports);


/***/ }),

/***/ "./src/common/adapters/playback-state.adapter.ts":
/*!*******************************************************!*\
  !*** ./src/common/adapters/playback-state.adapter.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.adaptPlaybackState = void 0;
const devices_adapter_1 = __webpack_require__(/*! ./devices.adapter */ "./src/common/adapters/devices.adapter.ts");
const tracks_adapter_1 = __webpack_require__(/*! ./tracks.adapter */ "./src/common/adapters/tracks.adapter.ts");
const adaptPlaybackState = ({ device, repeat_state, shuffle_state, is_playing, item, }) => {
    const [formattedDevice] = (0, devices_adapter_1.adaptDevices)([device]);
    const [formattedTrack] = (0, tracks_adapter_1.adaptTracks)([item]);
    return {
        device: formattedDevice,
        repeatState: repeat_state,
        shuffleState: shuffle_state,
        isPlaying: is_playing,
        track: formattedTrack,
    };
};
exports.adaptPlaybackState = adaptPlaybackState;


/***/ }),

/***/ "./src/common/adapters/profile.adapter.ts":
/*!************************************************!*\
  !*** ./src/common/adapters/profile.adapter.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.adaptProfile = void 0;
const adaptProfile = ({ id, display_name, email, images, country, external_urls: { spotify: href }, followers, }) => ({
    id,
    displayName: display_name,
    email,
    images,
    country,
    href,
    followers: followers.total,
});
exports.adaptProfile = adaptProfile;


/***/ }),

/***/ "./src/common/adapters/secret-data.adapter.ts":
/*!****************************************************!*\
  !*** ./src/common/adapters/secret-data.adapter.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.adaptSecretData = void 0;
const adaptSecretData = ({ access_token, refresh_token, expires_in, }) => ({
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresIn: expires_in,
});
exports.adaptSecretData = adaptSecretData;


/***/ }),

/***/ "./src/common/adapters/tracks.adapter.ts":
/*!***********************************************!*\
  !*** ./src/common/adapters/tracks.adapter.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.adaptTracks = exports.adaptTrack = void 0;
const adaptTrack = ({ id, name, album, artists, external_urls: { spotify: href }, duration_ms, progress_ms, played_at, }) => (Object.assign(Object.assign({ id,
    name, album: { name: album.name, images: album.images }, artists: artists.map(({ name, id, href }) => ({ name, id, href })), href, duration: duration_ms }, (progress_ms && { progress: progress_ms })), (played_at && { playedAt: played_at })));
exports.adaptTrack = adaptTrack;
const adaptTracks = (tracks) => tracks.map(track => (0, exports.adaptTrack)(track));
exports.adaptTracks = adaptTracks;


/***/ }),

/***/ "./src/common/dtos/album.dto.ts":
/*!**************************************!*\
  !*** ./src/common/dtos/album.dto.ts ***!
  \**************************************/
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
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const _1 = __webpack_require__(/*! . */ "./src/common/dtos/index.ts");
class Album {
}
exports.Album = Album;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Album.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Album.prototype, "artist", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [_1.ImageDto] }),
    __metadata("design:type", Array)
], Album.prototype, "images", void 0);


/***/ }),

/***/ "./src/common/dtos/analysis.dto.ts":
/*!*****************************************!*\
  !*** ./src/common/dtos/analysis.dto.ts ***!
  \*****************************************/
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
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class Analysis {
}
exports.Analysis = Analysis;
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


/***/ }),

/***/ "./src/common/dtos/artist.dto.ts":
/*!***************************************!*\
  !*** ./src/common/dtos/artist.dto.ts ***!
  \***************************************/
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
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const _1 = __webpack_require__(/*! . */ "./src/common/dtos/index.ts");
class Artist {
}
exports.Artist = Artist;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Artist.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Artist.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], Artist.prototype, "genres", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Artist.prototype, "href", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [_1.ImageDto] }),
    __metadata("design:type", Array)
], Artist.prototype, "images", void 0);
class TrackArtist {
}
exports.TrackArtist = TrackArtist;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TrackArtist.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TrackArtist.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TrackArtist.prototype, "href", void 0);


/***/ }),

/***/ "./src/common/dtos/device.dto.ts":
/*!***************************************!*\
  !*** ./src/common/dtos/device.dto.ts ***!
  \***************************************/
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
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class Device {
}
exports.Device = Device;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Device.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Device.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Device.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], Device.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], Device.prototype, "isPrivateSession", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], Device.prototype, "isRestricted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Device.prototype, "volumePercent", void 0);


/***/ }),

/***/ "./src/common/dtos/genres.dto.ts":
/*!***************************************!*\
  !*** ./src/common/dtos/genres.dto.ts ***!
  \***************************************/
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
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class Genres {
}
exports.Genres = Genres;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], Genres.prototype, "genres", void 0);


/***/ }),

/***/ "./src/common/dtos/image.dto.ts":
/*!**************************************!*\
  !*** ./src/common/dtos/image.dto.ts ***!
  \**************************************/
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
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class ImageDto {
}
exports.ImageDto = ImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ImageDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ImageDto.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ImageDto.prototype, "url", void 0);


/***/ }),

/***/ "./src/common/dtos/index.ts":
/*!**********************************!*\
  !*** ./src/common/dtos/index.ts ***!
  \**********************************/
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
__exportStar(__webpack_require__(/*! ./image.dto */ "./src/common/dtos/image.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./album.dto */ "./src/common/dtos/album.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./artist.dto */ "./src/common/dtos/artist.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./track.dto */ "./src/common/dtos/track.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./device.dto */ "./src/common/dtos/device.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./playback-state.dto */ "./src/common/dtos/playback-state.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./genres.dto */ "./src/common/dtos/genres.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./success.dto */ "./src/common/dtos/success.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./analysis.dto */ "./src/common/dtos/analysis.dto.ts"), exports);


/***/ }),

/***/ "./src/common/dtos/playback-state.dto.ts":
/*!***********************************************!*\
  !*** ./src/common/dtos/playback-state.dto.ts ***!
  \***********************************************/
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
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const _1 = __webpack_require__(/*! . */ "./src/common/dtos/index.ts");
const spotify_1 = __webpack_require__(/*! ~/common/types/spotify */ "./src/common/types/spotify/index.ts");
class PlaybackState {
}
exports.PlaybackState = PlaybackState;
__decorate([
    (0, swagger_1.ApiProperty)({ type: _1.Device }),
    __metadata("design:type", typeof (_a = typeof _1.Device !== "undefined" && _1.Device) === "function" ? _a : Object)
], PlaybackState.prototype, "device", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", typeof (_b = typeof spotify_1.RepeatedState !== "undefined" && spotify_1.RepeatedState) === "function" ? _b : Object)
], PlaybackState.prototype, "repeatState", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", typeof (_c = typeof spotify_1.ShuffleState !== "undefined" && spotify_1.ShuffleState) === "function" ? _c : Object)
], PlaybackState.prototype, "shuffleState", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], PlaybackState.prototype, "isPlaying", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: _1.Track }),
    __metadata("design:type", typeof (_d = typeof _1.Track !== "undefined" && _1.Track) === "function" ? _d : Object)
], PlaybackState.prototype, "track", void 0);


/***/ }),

/***/ "./src/common/dtos/success.dto.ts":
/*!****************************************!*\
  !*** ./src/common/dtos/success.dto.ts ***!
  \****************************************/
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
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class Success {
}
exports.Success = Success;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Boolean }),
    __metadata("design:type", Boolean)
], Success.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], Success.prototype, "message", void 0);


/***/ }),

/***/ "./src/common/dtos/track.dto.ts":
/*!**************************************!*\
  !*** ./src/common/dtos/track.dto.ts ***!
  \**************************************/
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
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const _1 = __webpack_require__(/*! . */ "./src/common/dtos/index.ts");
class Track {
}
exports.Track = Track;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Track.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Track.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], Track.prototype, "href", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [_1.TrackArtist] }),
    __metadata("design:type", Array)
], Track.prototype, "artists", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: _1.Album }),
    __metadata("design:type", typeof (_a = typeof _1.Album !== "undefined" && _1.Album) === "function" ? _a : Object)
], Track.prototype, "album", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], Track.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, required: false }),
    __metadata("design:type", Number)
], Track.prototype, "progress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], Track.prototype, "playedAt", void 0);


/***/ }),

/***/ "./src/common/types/spotify/album.ts":
/*!*******************************************!*\
  !*** ./src/common/types/spotify/album.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/common/types/spotify/artist.ts":
/*!********************************************!*\
  !*** ./src/common/types/spotify/artist.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/common/types/spotify/audio-features.ts":
/*!****************************************************!*\
  !*** ./src/common/types/spotify/audio-features.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/common/types/spotify/device.ts":
/*!********************************************!*\
  !*** ./src/common/types/spotify/device.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/common/types/spotify/image.ts":
/*!*******************************************!*\
  !*** ./src/common/types/spotify/image.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/common/types/spotify/index.ts":
/*!*******************************************!*\
  !*** ./src/common/types/spotify/index.ts ***!
  \*******************************************/
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
__exportStar(__webpack_require__(/*! ./image */ "./src/common/types/spotify/image.ts"), exports);
__exportStar(__webpack_require__(/*! ./spotify-response */ "./src/common/types/spotify/spotify-response.ts"), exports);
__exportStar(__webpack_require__(/*! ./album */ "./src/common/types/spotify/album.ts"), exports);
__exportStar(__webpack_require__(/*! ./artist */ "./src/common/types/spotify/artist.ts"), exports);
__exportStar(__webpack_require__(/*! ./track */ "./src/common/types/spotify/track.ts"), exports);
__exportStar(__webpack_require__(/*! ./profile */ "./src/common/types/spotify/profile.ts"), exports);
__exportStar(__webpack_require__(/*! ./spotify-token */ "./src/common/types/spotify/spotify-token.ts"), exports);
__exportStar(__webpack_require__(/*! ./device */ "./src/common/types/spotify/device.ts"), exports);
__exportStar(__webpack_require__(/*! ./playback-state */ "./src/common/types/spotify/playback-state.ts"), exports);
__exportStar(__webpack_require__(/*! ./audio-features */ "./src/common/types/spotify/audio-features.ts"), exports);


/***/ }),

/***/ "./src/common/types/spotify/playback-state.ts":
/*!****************************************************!*\
  !*** ./src/common/types/spotify/playback-state.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShuffleState = exports.RepeatedState = void 0;
var RepeatedState;
(function (RepeatedState) {
    RepeatedState["TRACK"] = "track";
    RepeatedState["CONTEXT"] = "context";
    RepeatedState["OFF"] = "off";
})(RepeatedState || (exports.RepeatedState = RepeatedState = {}));
var ShuffleState;
(function (ShuffleState) {
    ShuffleState["ON"] = "on";
    ShuffleState["OFF"] = "off";
})(ShuffleState || (exports.ShuffleState = ShuffleState = {}));


/***/ }),

/***/ "./src/common/types/spotify/profile.ts":
/*!*********************************************!*\
  !*** ./src/common/types/spotify/profile.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/common/types/spotify/spotify-response.ts":
/*!******************************************************!*\
  !*** ./src/common/types/spotify/spotify-response.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/common/types/spotify/spotify-token.ts":
/*!***************************************************!*\
  !*** ./src/common/types/spotify/spotify-token.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/common/types/spotify/track.ts":
/*!*******************************************!*\
  !*** ./src/common/types/spotify/track.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/config/environment.enum.ts":
/*!****************************************!*\
  !*** ./src/config/environment.enum.ts ***!
  \****************************************/
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
})(Environment || (exports.Environment = Environment = {}));


/***/ }),

/***/ "./src/config/index.ts":
/*!*****************************!*\
  !*** ./src/config/index.ts ***!
  \*****************************/
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
__exportStar(__webpack_require__(/*! ./environment.enum */ "./src/config/environment.enum.ts"), exports);


/***/ }),

/***/ "./src/modules/app/app.module.ts":
/*!***************************************!*\
  !*** ./src/modules/app/app.module.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const Joi = __webpack_require__(/*! joi */ "joi");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const auth_1 = __webpack_require__(/*! @modules/auth */ "./src/modules/auth/index.ts");
const statistics_1 = __webpack_require__(/*! @modules/statistics */ "./src/modules/statistics/index.ts");
const player_1 = __webpack_require__(/*! @modules/player */ "./src/modules/player/index.ts");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_1.AuthModule,
            statistics_1.StatisticsModule,
            player_1.PlayerModule,
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


/***/ }),

/***/ "./src/modules/app/index.ts":
/*!**********************************!*\
  !*** ./src/modules/app/index.ts ***!
  \**********************************/
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
__exportStar(__webpack_require__(/*! ./app.module */ "./src/modules/app/app.module.ts"), exports);


/***/ }),

/***/ "./src/modules/auth/auth.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/auth/auth.controller.ts ***!
  \*********************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const config_2 = __webpack_require__(/*! ./config */ "./src/modules/auth/config/index.ts");
const types_1 = __webpack_require__(/*! ./types */ "./src/modules/auth/types/index.ts");
const decorators_1 = __webpack_require__(/*! ./decorators */ "./src/modules/auth/decorators/index.ts");
const dtos_1 = __webpack_require__(/*! ./dtos */ "./src/modules/auth/dtos/index.ts");
const config_3 = __webpack_require__(/*! ~/config */ "./src/config/index.ts");
const enums_1 = __webpack_require__(/*! @modules/auth/enums */ "./src/modules/auth/enums/index.ts");
const { SPOTIFY_CALLBACK_URL, SPOTIFY_CLIENT_ID, SPOTIFY_ACCOUNTS_URL, CLIENT_CALLBACK_URL, } = config_3.Environment;
let AuthController = exports.AuthController = class AuthController {
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
        return this.authService.token({ refreshToken });
    }
    profile(accessToken) {
        return this.authService.profile(accessToken);
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
    __param(0, (0, decorators_1.Token)()),
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
    __param(0, (0, decorators_1.Token)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "profile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], AuthController);


/***/ }),

/***/ "./src/modules/auth/auth.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/auth/auth.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts");
const config_2 = __webpack_require__(/*! ~/config */ "./src/config/index.ts");
let AuthModule = exports.AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule = __decorate([
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
        ],
        providers: [auth_service_1.AuthService],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);


/***/ }),

/***/ "./src/modules/auth/auth.service.ts":
/*!******************************************!*\
  !*** ./src/modules/auth/auth.service.ts ***!
  \******************************************/
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const config_2 = __webpack_require__(/*! ~/config */ "./src/config/index.ts");
const utils_1 = __webpack_require__(/*! ~/utils */ "./src/utils/index.ts");
const adapters_1 = __webpack_require__(/*! @common/adapters */ "./src/common/adapters/index.ts");
let AuthService = exports.AuthService = class AuthService {
    constructor(jwtService, httpService, configService) {
        this.jwtService = jwtService;
        this.httpService = httpService;
        this.configService = configService;
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
            .pipe((0, rxjs_1.map)(response => response.data), (0, rxjs_1.map)(adapters_1.adaptSecretData), (0, rxjs_1.catchError)(utils_1.catchSpotifyError));
    }
    profile(accessToken) {
        return this.httpService
            .get('/me', (0, utils_1.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data), (0, rxjs_1.map)(adapters_1.adaptProfile), (0, rxjs_1.catchError)(utils_1.catchSpotifyError));
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], AuthService);


/***/ }),

/***/ "./src/modules/auth/config/index.ts":
/*!******************************************!*\
  !*** ./src/modules/auth/config/index.ts ***!
  \******************************************/
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
__exportStar(__webpack_require__(/*! ./spotify-authorization-scopes */ "./src/modules/auth/config/spotify-authorization-scopes.ts"), exports);


/***/ }),

/***/ "./src/modules/auth/config/spotify-authorization-scopes.ts":
/*!*****************************************************************!*\
  !*** ./src/modules/auth/config/spotify-authorization-scopes.ts ***!
  \*****************************************************************/
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

/***/ "./src/modules/auth/constants/index.ts":
/*!*********************************************!*\
  !*** ./src/modules/auth/constants/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BEARER = void 0;
exports.BEARER = 'bearer';


/***/ }),

/***/ "./src/modules/auth/decorators/api-auth.decorator.ts":
/*!***********************************************************!*\
  !*** ./src/modules/auth/decorators/api-auth.decorator.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiAuth = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const ApiAuth = (authenticationType) => (0, common_1.applyDecorators)((0, swagger_1.ApiUnauthorizedResponse)({
    description: 'The access token expired',
}), (0, swagger_1.ApiUnauthorizedResponse)({
    description: 'Invalid access token',
}), (0, swagger_1.ApiUnauthorizedResponse)({
    description: 'No value was provided for Authentication',
}), (0, swagger_1.ApiBearerAuth)(authenticationType));
exports.ApiAuth = ApiAuth;


/***/ }),

/***/ "./src/modules/auth/decorators/index.ts":
/*!**********************************************!*\
  !*** ./src/modules/auth/decorators/index.ts ***!
  \**********************************************/
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
__exportStar(__webpack_require__(/*! ./token.decorator */ "./src/modules/auth/decorators/token.decorator.ts"), exports);
__exportStar(__webpack_require__(/*! ./api-auth.decorator */ "./src/modules/auth/decorators/api-auth.decorator.ts"), exports);


/***/ }),

/***/ "./src/modules/auth/decorators/token.decorator.ts":
/*!********************************************************!*\
  !*** ./src/modules/auth/decorators/token.decorator.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Token = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
exports.Token = (0, common_1.createParamDecorator)((data, context) => {
    var _a, _b;
    const request = context.switchToHttp().getRequest();
    const token = (_b = (_a = request.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.slice(7);
    if (!token)
        throw new common_1.UnauthorizedException('No value was provided for Authentication');
    return token;
});


/***/ }),

/***/ "./src/modules/auth/dtos/index.ts":
/*!****************************************!*\
  !*** ./src/modules/auth/dtos/index.ts ***!
  \****************************************/
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
__exportStar(__webpack_require__(/*! ./profile.dto */ "./src/modules/auth/dtos/profile.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./secret-data.dto */ "./src/modules/auth/dtos/secret-data.dto.ts"), exports);


/***/ }),

/***/ "./src/modules/auth/dtos/profile.dto.ts":
/*!**********************************************!*\
  !*** ./src/modules/auth/dtos/profile.dto.ts ***!
  \**********************************************/
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
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const dtos_1 = __webpack_require__(/*! @common/dtos */ "./src/common/dtos/index.ts");
class ProfileDto {
}
exports.ProfileDto = ProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [dtos_1.ImageDto] }),
    __metadata("design:type", Array)
], ProfileDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], ProfileDto.prototype, "followers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ProfileDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], ProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ProfileDto.prototype, "href", void 0);


/***/ }),

/***/ "./src/modules/auth/dtos/secret-data.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/auth/dtos/secret-data.dto.ts ***!
  \**************************************************/
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
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class SecretData {
}
exports.SecretData = SecretData;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SecretData.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], SecretData.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    __metadata("design:type", Number)
], SecretData.prototype, "expiresIn", void 0);


/***/ }),

/***/ "./src/modules/auth/enums/authentication-type.enum.ts":
/*!************************************************************!*\
  !*** ./src/modules/auth/enums/authentication-type.enum.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthenticationType = void 0;
var AuthenticationType;
(function (AuthenticationType) {
    AuthenticationType["ACCESS_TOKEN"] = "access-token";
    AuthenticationType["REFRESH_TOKEN"] = "refresh-token";
})(AuthenticationType || (exports.AuthenticationType = AuthenticationType = {}));


/***/ }),

/***/ "./src/modules/auth/enums/index.ts":
/*!*****************************************!*\
  !*** ./src/modules/auth/enums/index.ts ***!
  \*****************************************/
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
__exportStar(__webpack_require__(/*! ./authentication-type.enum */ "./src/modules/auth/enums/authentication-type.enum.ts"), exports);


/***/ }),

/***/ "./src/modules/auth/index.ts":
/*!***********************************!*\
  !*** ./src/modules/auth/index.ts ***!
  \***********************************/
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
__exportStar(__webpack_require__(/*! ./config */ "./src/modules/auth/config/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./decorators */ "./src/modules/auth/decorators/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./dtos */ "./src/modules/auth/dtos/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./types */ "./src/modules/auth/types/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./enums */ "./src/modules/auth/enums/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts"), exports);
__exportStar(__webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts"), exports);
__exportStar(__webpack_require__(/*! ./auth.module */ "./src/modules/auth/auth.module.ts"), exports);


/***/ }),

/***/ "./src/modules/auth/types/index.ts":
/*!*****************************************!*\
  !*** ./src/modules/auth/types/index.ts ***!
  \*****************************************/
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
__exportStar(__webpack_require__(/*! ./jwt-payload */ "./src/modules/auth/types/jwt-payload.ts"), exports);
__exportStar(__webpack_require__(/*! ./redirect-response */ "./src/modules/auth/types/redirect-response.ts"), exports);
__exportStar(__webpack_require__(/*! ./token-options */ "./src/modules/auth/types/token-options.ts"), exports);


/***/ }),

/***/ "./src/modules/auth/types/jwt-payload.ts":
/*!***********************************************!*\
  !*** ./src/modules/auth/types/jwt-payload.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/modules/auth/types/redirect-response.ts":
/*!*****************************************************!*\
  !*** ./src/modules/auth/types/redirect-response.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/modules/auth/types/token-options.ts":
/*!*************************************************!*\
  !*** ./src/modules/auth/types/token-options.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ "./src/modules/player/index.ts":
/*!*************************************!*\
  !*** ./src/modules/player/index.ts ***!
  \*************************************/
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
__exportStar(__webpack_require__(/*! ./messages */ "./src/modules/player/messages/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./player.module */ "./src/modules/player/player.module.ts"), exports);
__exportStar(__webpack_require__(/*! ./player.service */ "./src/modules/player/player.service.ts"), exports);
__exportStar(__webpack_require__(/*! ./player.controller */ "./src/modules/player/player.controller.ts"), exports);


/***/ }),

/***/ "./src/modules/player/messages/index.ts":
/*!**********************************************!*\
  !*** ./src/modules/player/messages/index.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerMessage = void 0;
var PlayerMessage;
(function (PlayerMessage) {
    PlayerMessage["NO_AVAIBLE_DEVICES"] = "No device is avaible";
    PlayerMessage["NO_PLAYING_DEVICE"] = "No device is currently playing";
    PlayerMessage["DEVICE_ALREADY_PLAYING"] = "Device is already playing";
})(PlayerMessage || (exports.PlayerMessage = PlayerMessage = {}));


/***/ }),

/***/ "./src/modules/player/player.controller.ts":
/*!*************************************************!*\
  !*** ./src/modules/player/player.controller.ts ***!
  \*************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const player_service_1 = __webpack_require__(/*! ./player.service */ "./src/modules/player/player.service.ts");
const dtos_1 = __webpack_require__(/*! @common/dtos */ "./src/common/dtos/index.ts");
const auth_1 = __webpack_require__(/*! @modules/auth */ "./src/modules/auth/index.ts");
let PlayerController = exports.PlayerController = class PlayerController {
    constructor(playerService) {
        this.playerService = playerService;
    }
    availableDevices(accessToken) {
        return this.playerService.availableDevices(accessToken);
    }
    currentPlaybackState(accessToken) {
        return this.playerService.currentPlaybackState(accessToken);
    }
    pausePlayer(accessToken, afterTime, deviceId) {
        return this.playerService.pausePlayer(accessToken, afterTime, deviceId);
    }
    resumePlayer(accessToken, deviceId) {
        return this.playerService.resumePlayer(accessToken, deviceId);
    }
};
__decorate([
    (0, common_1.Get)('/devices'),
    (0, swagger_1.ApiOkResponse)({
        type: dtos_1.Device,
        description: 'Available devices has been succesfully found',
    }),
    __param(0, (0, auth_1.Token)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PlayerController.prototype, "availableDevices", null);
__decorate([
    (0, common_1.Get)('/state'),
    (0, swagger_1.ApiOkResponse)({
        type: dtos_1.PlaybackState,
        description: 'Current playback state has been succesfully found',
    }),
    __param(0, (0, auth_1.Token)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
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
    __param(0, (0, auth_1.Token)()),
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
    __param(0, (0, auth_1.Token)()),
    __param(1, (0, common_1.Query)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PlayerController.prototype, "resumePlayer", null);
exports.PlayerController = PlayerController = __decorate([
    (0, common_1.Controller)('player'),
    (0, swagger_1.ApiTags)('player'),
    (0, auth_1.ApiAuth)(auth_1.AuthenticationType.ACCESS_TOKEN),
    __metadata("design:paramtypes", [typeof (_a = typeof player_service_1.PlayerService !== "undefined" && player_service_1.PlayerService) === "function" ? _a : Object])
], PlayerController);


/***/ }),

/***/ "./src/modules/player/player.module.ts":
/*!*********************************************!*\
  !*** ./src/modules/player/player.module.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const player_service_1 = __webpack_require__(/*! ./player.service */ "./src/modules/player/player.service.ts");
const player_controller_1 = __webpack_require__(/*! ./player.controller */ "./src/modules/player/player.controller.ts");
const config_2 = __webpack_require__(/*! ~/config */ "./src/config/index.ts");
let PlayerModule = exports.PlayerModule = class PlayerModule {
};
exports.PlayerModule = PlayerModule = __decorate([
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
        ],
        controllers: [player_controller_1.PlayerController],
        providers: [player_service_1.PlayerService],
    })
], PlayerModule);


/***/ }),

/***/ "./src/modules/player/player.service.ts":
/*!**********************************************!*\
  !*** ./src/modules/player/player.service.ts ***!
  \**********************************************/
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
exports.PlayerService = void 0;
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const messages_1 = __webpack_require__(/*! ./messages */ "./src/modules/player/messages/index.ts");
const utils_1 = __webpack_require__(/*! ~/utils */ "./src/utils/index.ts");
const adapters_1 = __webpack_require__(/*! @common/adapters */ "./src/common/adapters/index.ts");
let PlayerService = exports.PlayerService = class PlayerService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    availableDevices(accessToken) {
        return this.httpService
            .get('/me/player/devices', (0, utils_1.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.devices), (0, rxjs_1.catchError)(utils_1.catchSpotifyError), (0, rxjs_1.tap)(devices => {
            if (devices.length <= 0)
                throw new common_1.ForbiddenException(messages_1.PlayerMessage.NO_AVAIBLE_DEVICES);
        }), (0, rxjs_1.map)(adapters_1.adaptDevices));
    }
    currentPlaybackState(accessToken) {
        return this.httpService
            .get('/me/player', (0, utils_1.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data), (0, rxjs_1.catchError)(utils_1.catchSpotifyError), (0, rxjs_1.tap)(playbackState => {
            if (!playbackState.device)
                throw new common_1.ForbiddenException(messages_1.PlayerMessage.NO_PLAYING_DEVICE);
        }), (0, rxjs_1.map)(adapters_1.adaptPlaybackState));
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
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object])
], PlayerService);


/***/ }),

/***/ "./src/modules/statistics/dtos/id.dto.ts":
/*!***********************************************!*\
  !*** ./src/modules/statistics/dtos/id.dto.ts ***!
  \***********************************************/
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
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class IdArguments {
}
exports.IdArguments = IdArguments;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IdArguments.prototype, "id", void 0);


/***/ }),

/***/ "./src/modules/statistics/dtos/index.ts":
/*!**********************************************!*\
  !*** ./src/modules/statistics/dtos/index.ts ***!
  \**********************************************/
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
__exportStar(__webpack_require__(/*! ./limit.dto */ "./src/modules/statistics/dtos/limit.dto.ts"), exports);
__exportStar(__webpack_require__(/*! ./id.dto */ "./src/modules/statistics/dtos/id.dto.ts"), exports);


/***/ }),

/***/ "./src/modules/statistics/dtos/limit.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/statistics/dtos/limit.dto.ts ***!
  \**************************************************/
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
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class LimitArguments {
}
exports.LimitArguments = LimitArguments;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], LimitArguments.prototype, "limit", void 0);


/***/ }),

/***/ "./src/modules/statistics/index.ts":
/*!*****************************************!*\
  !*** ./src/modules/statistics/index.ts ***!
  \*****************************************/
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
__exportStar(__webpack_require__(/*! ./dtos */ "./src/modules/statistics/dtos/index.ts"), exports);
__exportStar(__webpack_require__(/*! ./statistics.module */ "./src/modules/statistics/statistics.module.ts"), exports);
__exportStar(__webpack_require__(/*! ./statistics.service */ "./src/modules/statistics/statistics.service.ts"), exports);
__exportStar(__webpack_require__(/*! ./statistics.controller */ "./src/modules/statistics/statistics.controller.ts"), exports);


/***/ }),

/***/ "./src/modules/statistics/statistics.controller.ts":
/*!*********************************************************!*\
  !*** ./src/modules/statistics/statistics.controller.ts ***!
  \*********************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const statistics_service_1 = __webpack_require__(/*! ./statistics.service */ "./src/modules/statistics/statistics.service.ts");
const dtos_1 = __webpack_require__(/*! ./dtos */ "./src/modules/statistics/dtos/index.ts");
const auth_1 = __webpack_require__(/*! @modules/auth */ "./src/modules/auth/index.ts");
const enums_1 = __webpack_require__(/*! @modules/auth/enums */ "./src/modules/auth/enums/index.ts");
const dtos_2 = __webpack_require__(/*! @common/dtos */ "./src/common/dtos/index.ts");
let StatisticsController = exports.StatisticsController = class StatisticsController {
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
    __param(0, (0, auth_1.Token)()),
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
    __param(0, (0, auth_1.Token)()),
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
    __param(0, (0, auth_1.Token)()),
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
    __param(0, (0, auth_1.Token)()),
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
    __param(0, (0, auth_1.Token)()),
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
    __param(0, (0, auth_1.Token)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StatisticsController.prototype, "analysis", null);
exports.StatisticsController = StatisticsController = __decorate([
    (0, common_1.Controller)('statistics'),
    (0, swagger_1.ApiTags)('statistics'),
    (0, auth_1.ApiAuth)(enums_1.AuthenticationType.ACCESS_TOKEN),
    __metadata("design:paramtypes", [typeof (_a = typeof statistics_service_1.StatisticsService !== "undefined" && statistics_service_1.StatisticsService) === "function" ? _a : Object])
], StatisticsController);


/***/ }),

/***/ "./src/modules/statistics/statistics.module.ts":
/*!*****************************************************!*\
  !*** ./src/modules/statistics/statistics.module.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatisticsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const statistics_service_1 = __webpack_require__(/*! ./statistics.service */ "./src/modules/statistics/statistics.service.ts");
const statistics_controller_1 = __webpack_require__(/*! ./statistics.controller */ "./src/modules/statistics/statistics.controller.ts");
const auth_1 = __webpack_require__(/*! @modules/auth */ "./src/modules/auth/index.ts");
const config_2 = __webpack_require__(/*! ~/config */ "./src/config/index.ts");
let StatisticsModule = exports.StatisticsModule = class StatisticsModule {
};
exports.StatisticsModule = StatisticsModule = __decorate([
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
            auth_1.AuthModule,
        ],
        controllers: [statistics_controller_1.StatisticsController],
        providers: [statistics_service_1.StatisticsService],
    })
], StatisticsModule);


/***/ }),

/***/ "./src/modules/statistics/statistics.service.ts":
/*!******************************************************!*\
  !*** ./src/modules/statistics/statistics.service.ts ***!
  \******************************************************/
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
exports.StatisticsService = void 0;
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const rxjs_1 = __webpack_require__(/*! rxjs */ "rxjs");
const utils_1 = __webpack_require__(/*! ./utils */ "./src/modules/statistics/utils/index.ts");
const utils_2 = __webpack_require__(/*! ~/utils */ "./src/utils/index.ts");
const adapters_1 = __webpack_require__(/*! @common/adapters */ "./src/common/adapters/index.ts");
let StatisticsService = exports.StatisticsService = class StatisticsService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    lastTracks(accessToken, limit = 20) {
        return this.httpService
            .get(`/me/player/recently-played?limit=${limit}`, (0, utils_2.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.items), (0, rxjs_1.map)(items => items.map(({ track, played_at }) => (Object.assign(Object.assign({}, track), { played_at })))), (0, rxjs_1.map)(adapters_1.adaptTracks), (0, rxjs_1.catchError)(utils_2.catchSpotifyError));
    }
    topGenres(accessToken, limit = 10) {
        return this.httpService
            .get(`/me/top/artists?limit=${50}&time_range=long_term`, (0, utils_2.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.items), (0, rxjs_1.map)(items => (0, adapters_1.adaptGenres)(items, limit)), (0, rxjs_1.catchError)(utils_2.catchSpotifyError));
    }
    topArtists(accessToken, limit = 10) {
        return this.httpService
            .get(`/me/top/artists?limit=${limit}&time_range=long_term`, (0, utils_2.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.items), (0, rxjs_1.map)(adapters_1.adaptArtists), (0, rxjs_1.catchError)(utils_2.catchSpotifyError));
    }
    topTracks(accessToken, limit = 10) {
        return this.httpService
            .get(`/me/top/tracks?limit=${limit}&time_range=long_term`, (0, utils_2.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data.items), (0, rxjs_1.map)(adapters_1.adaptTracks), (0, rxjs_1.catchError)(utils_2.catchSpotifyError));
    }
    artist(accessToken, id) {
        return this.httpService
            .get(`/artists/${id}`, (0, utils_2.applyAuthorizationHeader)(accessToken))
            .pipe((0, rxjs_1.map)(response => response.data), (0, rxjs_1.map)(adapters_1.adaptArtist), (0, rxjs_1.catchError)(utils_2.catchSpotifyError));
    }
    analysis(accessToken) {
        return this.topTracks(accessToken, 50).pipe((0, rxjs_1.mergeMap)(tracks => {
            const tracksIds = tracks.map(({ id }) => id).join(',');
            return this.httpService
                .get(`/audio-features?ids=${tracksIds}`, (0, utils_2.applyAuthorizationHeader)(accessToken))
                .pipe((0, rxjs_1.map)(response => response.data.audio_features), (0, rxjs_1.map)(audioFeatures => audioFeatures.map(audioFeature => (0, adapters_1.adaptAudioFeatures)(audioFeature))), (0, rxjs_1.map)(utils_1.analysisFactory), (0, rxjs_1.catchError)(utils_2.catchSpotifyError));
        }));
    }
};
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object])
], StatisticsService);


/***/ }),

/***/ "./src/modules/statistics/utils/analysis-factory.ts":
/*!**********************************************************!*\
  !*** ./src/modules/statistics/utils/analysis-factory.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.analysisFactory = void 0;
const audio_features_reducer_1 = __webpack_require__(/*! ./audio-features-reducer */ "./src/modules/statistics/utils/audio-features-reducer.ts");
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

/***/ "./src/modules/statistics/utils/audio-features-reducer.ts":
/*!****************************************************************!*\
  !*** ./src/modules/statistics/utils/audio-features-reducer.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.audioFeaturesReducer = void 0;
const audioFeaturesReducer = (accumulator, currentValue) => accumulator + currentValue;
exports.audioFeaturesReducer = audioFeaturesReducer;


/***/ }),

/***/ "./src/modules/statistics/utils/index.ts":
/*!***********************************************!*\
  !*** ./src/modules/statistics/utils/index.ts ***!
  \***********************************************/
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
__exportStar(__webpack_require__(/*! ./audio-features-reducer */ "./src/modules/statistics/utils/audio-features-reducer.ts"), exports);
__exportStar(__webpack_require__(/*! ./analysis-factory */ "./src/modules/statistics/utils/analysis-factory.ts"), exports);


/***/ }),

/***/ "./src/utils/apply-authorization-header.ts":
/*!*************************************************!*\
  !*** ./src/utils/apply-authorization-header.ts ***!
  \*************************************************/
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

/***/ "./src/utils/axios-response-mock-factory.ts":
/*!**************************************************!*\
  !*** ./src/utils/axios-response-mock-factory.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.axiosResponseMockFactory = void 0;
const axiosResponseMockFactory = (data) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
});
exports.axiosResponseMockFactory = axiosResponseMockFactory;


/***/ }),

/***/ "./src/utils/catch-spotify-error.ts":
/*!******************************************!*\
  !*** ./src/utils/catch-spotify-error.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.catchSpotifyError = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
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

/***/ "./src/utils/get-most-frequent-items.ts":
/*!**********************************************!*\
  !*** ./src/utils/get-most-frequent-items.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getMostFrequentItems = void 0;
function getMostFrequentItems(array, limit = 1) {
    if (array.length === 0)
        return array;
    const frequencies = {};
    for (const item of array) {
        frequencies[item] =
            frequencies[item] === undefined ? 1 : frequencies[item] + 1;
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

/***/ "./src/utils/get-parameter-decorator-factory.ts":
/*!******************************************************!*\
  !*** ./src/utils/get-parameter-decorator-factory.ts ***!
  \******************************************************/
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
const constants_1 = __webpack_require__(/*! @nestjs/common/constants */ "@nestjs/common/constants");
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

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
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
__exportStar(__webpack_require__(/*! ./get-most-frequent-items */ "./src/utils/get-most-frequent-items.ts"), exports);
__exportStar(__webpack_require__(/*! ./catch-spotify-error */ "./src/utils/catch-spotify-error.ts"), exports);
__exportStar(__webpack_require__(/*! ./get-parameter-decorator-factory */ "./src/utils/get-parameter-decorator-factory.ts"), exports);
__exportStar(__webpack_require__(/*! ./apply-authorization-header */ "./src/utils/apply-authorization-header.ts"), exports);
__exportStar(__webpack_require__(/*! ./axios-response-mock-factory */ "./src/utils/axios-response-mock-factory.ts"), exports);


/***/ }),

/***/ "@nestjs/axios":
/*!********************************!*\
  !*** external "@nestjs/axios" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/common/constants":
/*!*******************************************!*\
  !*** external "@nestjs/common/constants" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@nestjs/common/constants");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),

/***/ "joi":
/*!**********************!*\
  !*** external "joi" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("joi");

/***/ }),

/***/ "rxjs":
/*!***********************!*\
  !*** external "rxjs" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("rxjs");

/***/ })

/******/ 	});
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
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const cookieParser = __webpack_require__(/*! cookie-parser */ "cookie-parser");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const config_2 = __webpack_require__(/*! ./config */ "./src/config/index.ts");
const app_1 = __webpack_require__(/*! @modules/app */ "./src/modules/app/index.ts");
const enums_1 = __webpack_require__(/*! @modules/auth/enums */ "./src/modules/auth/enums/index.ts");
const constants_1 = __webpack_require__(/*! @modules/auth/constants */ "./src/modules/auth/constants/index.ts");
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