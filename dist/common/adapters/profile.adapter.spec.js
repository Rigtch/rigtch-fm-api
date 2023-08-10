"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _mocks = require("../mocks/index");
const _profileadapter = require("./profile.adapter");
(0, _vitest.describe)('adaptProfile', ()=>{
    (0, _vitest.test)('should adapt profile', ()=>{
        (0, _vitest.expect)((0, _profileadapter.adaptProfile)(_mocks.spotifyProfileMock)).toEqual(_mocks.formattedProfileMock);
    });
});

//# sourceMappingURL=profile.adapter.spec.js.map