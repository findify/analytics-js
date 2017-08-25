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
var isEqual = require("lodash/isEqual");
var storage = require("./modules/storage");
var requestApi_1 = require("./modules/requestApi");
var generateId_1 = require("./utils/generateId");
var cleanObject_1 = require("./utils/cleanObject");
var validations_1 = require("./validations");
var listenHelpers_1 = require("./helpers/listenHelpers");
var filtersHelpers_1 = require("./helpers/filtersHelpers");
var env = require("./env");
var uidKey = env.storage.uniqKey;
var sidKey = env.storage.visitKey;
var cartKey = env.storage.cartKey;
var readUid = function () { return storage.read(uidKey); };
var readSid = function () { return storage.read(sidKey); };
var writeUid = function () { return storage.write(uidKey, generateId_1.generateId(), true); };
var writeSid = function () { return storage.write(sidKey, generateId_1.generateId()); };
var readCart = function () { return storage.read(cartKey); };
var writeCart = function (data) { return storage.write(cartKey, data); };
var init = function (cfg) {
    var config = __assign({}, cfg, { platform: cfg.platform || {} });
    validations_1.validateInitParams(config);
    var initialSid = readSid();
    var initialUid = readUid();
    var idsData = {};
    var filtersData = [];
    if (!initialSid)
        writeSid();
    if (!initialUid)
        writeUid();
    return {
        getUser: function () {
            var uid = readUid();
            var sid = readSid();
            return {
                uid: uid,
                sid: sid,
                exist: !!(uid && sid),
                persist: !!(initialSid && initialUid)
            };
        },
        sendEvent: function (name, request, endpoint) {
            validations_1.validateSendEventParams(name, request, config);
            var user = this.getUser();
            var key = config.key;
            if (!user.exist)
                return;
            var properties = name === 'view-page' ? __assign({}, request, { url: window.location.href, ref: window.document.referrer, width: window.screen.width, height: window.screen.height }) : request;
            return requestApi_1.requestApi({
                key: key,
                user: user,
                properties: cleanObject_1.cleanObject(properties),
                event: name,
            }, endpoint);
        },
        listen: function (context) {
            var _this = this;
            var node = context || document;
            node.addEventListener('click', function (e) {
                var target = e.target;
                if (listenHelpers_1.isEvent('click-suggestion', target)) {
                    return listenHelpers_1.writeClickThroughCookie('click-suggestion', listenHelpers_1.getClickSuggestionData(target));
                }
                if (listenHelpers_1.isEvent('click-item', target)) {
                    return listenHelpers_1.writeClickThroughCookie('click-item', listenHelpers_1.getClickItemData(target));
                }
                if (listenHelpers_1.isEvent('add-to-cart', target)) {
                    return _this.sendEvent('add-to-cart', listenHelpers_1.getAddToCartData(target));
                }
            });
            if (!context) {
                var init_1 = function () {
                    var viewPageNode = listenHelpers_1.getEventNode('view-page', node);
                    var filterNodes = listenHelpers_1.getFilterNodes(node);
                    var purchaseNode = listenHelpers_1.getEventNode('purchase', node);
                    var updateCartNode = listenHelpers_1.getEventNode('update-cart', node);
                    var viewPageFallbackNode = node.querySelector('.findify_page_product');
                    var purchaseFallbackNode = node.querySelector('.findify_purchase_order');
                    var clickThroughCookie = listenHelpers_1.readClickThroughCookie();
                    var getItemsIds = function (items) { return items.map(function (item) { return item.item_id; }); };
                    if (clickThroughCookie) {
                        listenHelpers_1.clearClickThroughCookie();
                        var type = clickThroughCookie.type, request = clickThroughCookie.request;
                        _this.sendEvent(type, request);
                    }
                    if (purchaseFallbackNode) {
                        var data = listenHelpers_1.getPurchaseFallbackData(purchaseFallbackNode);
                        _this.sendEvent('purchase', data, config.platform.bigcommerce ? env.bigcommerceTrackingUrl : void 0);
                    }
                    if (filterNodes.length) {
                        filtersData = filtersHelpers_1.convertFilterNodesToArray(filterNodes);
                    }
                    if (listenHelpers_1.isEvent('view-page', viewPageNode) || viewPageFallbackNode) {
                        if (listenHelpers_1.isEvent('view-page', viewPageNode)) {
                            var viewPageData = listenHelpers_1.getViewPageData(viewPageNode);
                            idsData.item_id = viewPageData.item_id;
                            _this.sendEvent('view-page', viewPageData);
                        }
                        if (viewPageFallbackNode) {
                            var viewPageData = listenHelpers_1.getViewPageFallbackData(viewPageFallbackNode);
                            idsData.item_id = viewPageData.item_id;
                            _this.sendEvent('view-page', viewPageData);
                        }
                    }
                    else {
                        _this.sendEvent('view-page', {});
                    }
                    if (listenHelpers_1.isEvent('purchase', purchaseNode)) {
                        _this.sendEvent('purchase', listenHelpers_1.getPurchaseData(purchaseNode));
                    }
                    if (listenHelpers_1.isEvent('update-cart', updateCartNode)) {
                        var updateCartData = listenHelpers_1.getUpdateCartData(updateCartNode);
                        var itemsIds = getItemsIds(updateCartData.line_items);
                        var storageCart = readCart();
                        var isCartUpdated = !isEqual(storageCart, updateCartData);
                        idsData.item_ids = itemsIds;
                        if (isCartUpdated) {
                            _this.sendEvent('update-cart', updateCartData);
                            writeCart(updateCartData);
                        }
                    }
                };
                if (['complete', 'loaded', 'interactive'].indexOf(document.readyState) > -1 && document.body) {
                    init_1();
                }
                else {
                    document.addEventListener('DOMContentLoaded', init_1, false);
                }
            }
        },
        getIdsData: function () {
            return idsData;
        },
        getFiltersData: function () {
            return filtersData;
        },
        writeClickThroughCookie: listenHelpers_1.writeClickThroughCookie,
    };
};
exports.init = init;
