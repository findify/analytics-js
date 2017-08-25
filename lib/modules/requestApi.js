"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var qs = require("qs");
var env = require("../env");
function requestApi(data, endpoint) {
    return new Promise(function (resolve, reject) {
        var queryString = qs.stringify(__assign({}, data, { t_client: Date.now() }));
        var image = window.document.createElement('img');
        image.onload = resolve;
        image.onerror = resolve;
        image.src = makeSrc(queryString, endpoint);
    });
}
exports.requestApi = requestApi;
function makeSrc(queryString, endpoint) {
    if (!endpoint)
        return env.searchApi.url + '/feedback?' + queryString;
    return endpoint + '?' + queryString;
}
