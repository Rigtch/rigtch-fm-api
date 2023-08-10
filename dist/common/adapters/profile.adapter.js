"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "adaptProfile", {
    enumerable: true,
    get: function() {
        return adaptProfile;
    }
});
const adaptProfile = ({ id, display_name, email, images, country, external_urls: { spotify: href }, followers })=>({
        id,
        displayName: display_name,
        email,
        images,
        country,
        href,
        followers: followers.total
    });

//# sourceMappingURL=profile.adapter.js.map