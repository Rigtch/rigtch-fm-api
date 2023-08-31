"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "adaptPaginated", {
    enumerable: true,
    get: function() {
        return adaptPaginated;
    }
});
const adaptPaginated = (data, adaptFunction)=>{
    const { items, next, href, limit, offset } = data;
    return {
        offset,
        limit,
        next,
        href,
        items: adaptFunction(items)
    };
};

//# sourceMappingURL=paginated.adapter.js.map