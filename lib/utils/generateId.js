"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbols = '0123456789acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ';
function generateId() {
    var str = '';
    for (var i = 0; i < 16; i++) {
        str += symbols[(Math.random() * symbols.length | 0)];
    }
    return str;
}
exports.generateId = generateId;
