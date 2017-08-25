"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NAME_SELECTOR = 'data-findify-filter';
var VALUE_SELECTOR = 'data-findify-filter-value';
var convertFilterNodesToArray = function (nodes) {
    return Array.prototype.slice.call(nodes)
        .map(function (node) {
        var name = node.getAttribute(NAME_SELECTOR);
        var value = node.getAttribute(VALUE_SELECTOR);
        var values = void 0;
        try {
            values = JSON.parse(value);
        }
        catch (e) {
            values = [{ value: value.split(',').split('>').map(function (v) { return v && v.trim(); }) }];
        }
        return { name: name, values: values };
    })
        .filter(function (i) { return !!i; });
};
exports.convertFilterNodesToArray = convertFilterNodesToArray;
