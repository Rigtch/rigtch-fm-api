"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export_star(require("./artists.adapter"), exports);
_export_star(require("./devices.adapter"), exports);
_export_star(require("./genres.adapter"), exports);
_export_star(require("./playback-state.adapter"), exports);
_export_star(require("./tracks.adapter"), exports);
_export_star(require("./profile.adapter"), exports);
_export_star(require("./audio-features.adapter"), exports);
_export_star(require("./secret-data.adapter"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}

//# sourceMappingURL=index.js.map