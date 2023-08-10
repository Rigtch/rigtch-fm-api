"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export_star(require("./artist.mock"), exports);
_export_star(require("./track.mock"), exports);
_export_star(require("./profile.mock"), exports);
_export_star(require("./device.mock"), exports);
_export_star(require("./playback-state.mock"), exports);
_export_star(require("./genres.mock"), exports);
_export_star(require("./audio-features.mock"), exports);
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