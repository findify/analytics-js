"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var store = require("store");
var expire = require("store/plugins/expire");
store.addPlugin(expire);
function read(name) {
    return store.get(name);
}
exports.read = read;
function write(name, value, permanent) {
    var ttl = permanent ? (1000 * 3600 * 24 * 365 * 30) : (1000 * 60 * 30);
    if (!value)
        return store.remove(name);
    return store.set(name, value, new Date().getTime() + ttl);
}
exports.write = write;
