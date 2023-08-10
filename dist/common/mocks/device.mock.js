"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    spotifyDeviceMock: function() {
        return spotifyDeviceMock;
    },
    spotifyDevicesMock: function() {
        return spotifyDevicesMock;
    },
    formattedDeviceMock: function() {
        return formattedDeviceMock;
    },
    formattedDevicesMock: function() {
        return formattedDevicesMock;
    }
});
const spotifyDeviceMock = {
    id: 'id',
    is_active: true,
    is_private_session: false,
    is_restricted: false,
    name: 'name',
    type: 'type',
    volume_percent: 100
};
const spotifyDevicesMock = Array.from({
    length: 5
}, ()=>spotifyDeviceMock);
const formattedDeviceMock = {
    id: 'id',
    name: 'name',
    type: 'type',
    isActive: true,
    isPrivateSession: false,
    isRestricted: false,
    volumePercent: 100
};
const formattedDevicesMock = Array.from({
    length: 5
}, ()=>formattedDeviceMock);

//# sourceMappingURL=device.mock.js.map