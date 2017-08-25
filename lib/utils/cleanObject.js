"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reduce = require("lodash/reduce");
var assign = require("lodash/assign");
var isNull = require("lodash/isNull");
function cleanObject(obj) {
    return reduce(obj, function (acc, value, key) {
        return (typeof value === 'undefined' || isNull(value) || value === '' ? (acc) : (assign({}, acc, (_a = {},
            _a[key] = value,
            _a))));
        var _a;
    }, {});
}
exports.cleanObject = cleanObject;
