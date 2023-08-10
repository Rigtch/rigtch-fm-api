"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export_star(require("./image.dto"), exports);
_export_star(require("./album.dto"), exports);
_export_star(require("./artist.dto"), exports);
_export_star(require("./track.dto"), exports);
_export_star(require("./device.dto"), exports);
_export_star(require("./playback-state.dto"), exports);
_export_star(require("./genres.dto"), exports);
_export_star(require("./success.dto"), exports);
_export_star(require("./analysis.dto"), exports);
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