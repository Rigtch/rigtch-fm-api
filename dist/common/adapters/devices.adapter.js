"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "adaptDevices", {
    enumerable: true,
    get: function() {
        return adaptDevices;
    }
});
const adaptDevices = (devices)=>devices.map(({ id, name, type, is_active: isActive, is_private_session: isPrivateSession, is_restricted: isRestricted, volume_percent: volumePercent })=>({
            id,
            name,
            type,
            isActive,
            isPrivateSession,
            isRestricted,
            volumePercent
        }));

//# sourceMappingURL=devices.adapter.js.map