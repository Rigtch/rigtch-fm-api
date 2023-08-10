"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "axiosResponseMockFactory", {
    enumerable: true,
    get: function() {
        return axiosResponseMockFactory;
    }
});
const axiosResponseMockFactory = (data)=>({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
    });

//# sourceMappingURL=axios-response-mock-factory.js.map