"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _vitest = require("vitest");
const _ = require("./index");
(0, _vitest.describe)('GetMostFrequentItems', ()=>{
    (0, _vitest.test)('should get most frequent item', ()=>{
        (0, _vitest.expect)((0, _.getMostFrequentItems)([
            'a',
            'a',
            'b',
            'c',
            'c',
            'c'
        ])).toEqual([
            'c'
        ]);
    });
    (0, _vitest.test)('should get most frequent items', ()=>{
        (0, _vitest.expect)((0, _.getMostFrequentItems)([
            'a',
            'a',
            'b',
            'c',
            'c',
            'c'
        ], 2)).toEqual([
            'c',
            'a'
        ]);
    });
    (0, _vitest.test)('should return an empty array, because there are no items', ()=>{
        (0, _vitest.expect)((0, _.getMostFrequentItems)([])).toEqual([]);
    });
    (0, _vitest.test)('should return first item, because there are no repeated items', ()=>{
        (0, _vitest.expect)((0, _.getMostFrequentItems)([
            'a',
            'b',
            'c'
        ])).toEqual([
            'a'
        ]);
    });
});

//# sourceMappingURL=get-most-frequent-items.spec.js.map