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
    RepeatedState: function() {
        return RepeatedState;
    },
    ShuffleState: function() {
        return ShuffleState;
    }
});
var RepeatedState;
(function(RepeatedState) {
    RepeatedState["TRACK"] = 'track';
    RepeatedState["CONTEXT"] = 'context';
    RepeatedState["OFF"] = 'off';
})(RepeatedState || (RepeatedState = {}));
var ShuffleState;
(function(ShuffleState) {
    ShuffleState["ON"] = 'on';
    ShuffleState["OFF"] = 'off';
})(ShuffleState || (ShuffleState = {}));

//# sourceMappingURL=playback-state.js.map