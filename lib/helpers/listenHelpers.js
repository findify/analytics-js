"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var storage = require("../modules/storage");
var cleanObject_1 = require("../utils/cleanObject");
var env = require("../env");
var isEvent = function (name, node) { return node && node.getAttribute && node.getAttribute('data-findify-event') === name; };
exports.isEvent = isEvent;
var getEventNode = function (name, context) { return context.querySelector("[data-findify-event=\"" + name + "\"]"); };
exports.getEventNode = getEventNode;
var getFilterNodes = function (context) { return context.querySelectorAll("[data-findify-filter]"); };
exports.getFilterNodes = getFilterNodes;
var getClickSuggestionData = function (node) { return ({
    suggestion: node.getAttribute('data-findify-suggestion'),
    rid: node.getAttribute('data-findify-rid'),
}); };
exports.getClickSuggestionData = getClickSuggestionData;
var getClickItemData = function (node) { return ({
    item_id: node.getAttribute('data-findify-item-id'),
    variant_item_id: node.getAttribute('data-findify-variant-item-id'),
    rid: node.getAttribute('data-findify-rid'),
}); };
exports.getClickItemData = getClickItemData;
var getAddToCartData = function (node) { return ({
    item_id: node.getAttribute('data-findify-item-id'),
    variant_item_id: node.getAttribute('data-findify-variant-item-id'),
    rid: node.getAttribute('data-findify-rid'),
    quantity: node.getAttribute('data-findify-quantity'),
}); };
exports.getAddToCartData = getAddToCartData;
var getViewPageData = function (node) { return ({
    item_id: node.getAttribute('data-findify-item-id'),
    variant_item_id: node.getAttribute('data-findify-variant-item-id'),
}); };
exports.getViewPageData = getViewPageData;
var getPurchaseData = function (node) { return ({
    order_id: node.getAttribute('data-findify-order-id'),
    currency: node.getAttribute('data-findify-currency'),
    revenue: node.getAttribute('data-findify-revenue'),
    affiliation: node.getAttribute('data-findify-affiliation'),
    line_items: getLineItemsData(node.children),
}); };
exports.getPurchaseData = getPurchaseData;
var getUpdateCartData = function (node) { return ({
    line_items: getLineItemsData(node.children),
}); };
exports.getUpdateCartData = getUpdateCartData;
var getLineItemsData = function (nodeList) { return Array.prototype.slice.call(nodeList).map(function (element) { return cleanObject_1.cleanObject({
    item_id: element.getAttribute('data-findify-item-id'),
    variant_item_id: element.getAttribute('data-findify-variant-item-id'),
    unit_price: element.getAttribute('data-findify-unit-price'),
    quantity: element.getAttribute('data-findify-quantity'),
}); }); };
exports.getLineItemsData = getLineItemsData;
var getViewPageFallbackData = function (node) { return ({
    item_id: node.innerHTML,
}); };
exports.getViewPageFallbackData = getViewPageFallbackData;
var getPurchaseFallbackData = function (node) {
    var orderIdNode = node.querySelector('.order_number');
    var currencyNode = node.querySelector('.price_currency_code');
    var lineItems = Array.prototype.slice.call(node.querySelectorAll('.line_item')).map(function (element) {
        var itemIdNode = element.querySelector('.product_id');
        var unitPriceNode = element.querySelector('.unit_price');
        var quantityNode = element.querySelector('.quantity');
        return {
            item_id: itemIdNode && itemIdNode.innerHTML,
            unit_price: unitPriceNode && unitPriceNode.innerHTML,
            quantity: quantityNode && quantityNode.innerHTML,
        };
    });
    return cleanObject_1.cleanObject({
        order_id: orderIdNode && orderIdNode.innerHTML,
        currency: currencyNode ? currencyNode.innerHTML : undefined,
        revenue: lineItems.length ? (lineItems.reduce(function (amount, _a) {
            var unit_price = _a.unit_price;
            return amount + parseFloat(unit_price);
        }, 0)) : undefined,
        line_items: lineItems.length ? lineItems : undefined,
    });
};
exports.getPurchaseFallbackData = getPurchaseFallbackData;
var writeClickThroughCookie = function (type, request) {
    storage.write(env.storage.ctKey, type + "#" + JSON.stringify(request));
};
exports.writeClickThroughCookie = writeClickThroughCookie;
var readClickThroughCookie = function () {
    var data = storage.read(env.storage.ctKey);
    if (!data) {
        return;
    }
    var _a = data.split('#'), type = _a[0], requestString = _a[1];
    return {
        type: type,
        request: JSON.parse(requestString),
    };
};
exports.readClickThroughCookie = readClickThroughCookie;
var clearClickThroughCookie = function () {
    storage.write(env.storage.ctKey);
};
exports.clearClickThroughCookie = clearClickThroughCookie;
