"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _mocks = require("../mocks/index");
const _devicesadapter = require("./devices.adapter");
(0, _vitest.describe)('adaptDevices', ()=>{
    (0, _vitest.test)('should adapt devices', ()=>{
        (0, _vitest.expect)((0, _devicesadapter.adaptDevices)(_mocks.spotifyDevicesMock)).toEqual(_mocks.formattedDevicesMock);
    });
});

//# sourceMappingURL=devices.adapter.spec.js.map