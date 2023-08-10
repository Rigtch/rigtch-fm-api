"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getParameterDecoratorFactory", {
    enumerable: true,
    get: function() {
        return getParameterDecoratorFactory;
    }
});
const _constants = require("@nestjs/common/constants");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
function getParameterDecoratorFactory(decorator) {
    let Test = class Test {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
        test(value) {}
    };
    _ts_decorate([
        _ts_param(0, decorator()),
        _ts_metadata("design:type", Function),
        _ts_metadata("design:paramtypes", [
            void 0
        ])
    ], Test.prototype, "test", null);
    const arguments_ = Reflect.getMetadata(_constants.ROUTE_ARGS_METADATA, Test, 'test');
    return arguments_[Object.keys(arguments_)[0]].factory;
}

//# sourceMappingURL=get-parameter-decorator-factory.js.map