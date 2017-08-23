import isEqual = require('lodash/isEqual');

import * as storage from './modules/storage';
import { requestApi } from './modules/requestApi';
import { generateId } from './utils/generateId';
import { cleanObject } from './utils/cleanObject';
import { validateSendEventParams, validateInitParams } from './validations';

import {
  isEvent,
  getEventNode,
  getFilterNodes,
  getClickSuggestionData,
  getClickItemData,
  getAddToCartData,
  getViewPageData,
  getPurchaseData,
  getUpdateCartData,
  getLineItemsData,
  getViewPageFallbackData,
  getPurchaseFallbackData,
  writeClickThroughCookie,
  readClickThroughCookie,
  clearClickThroughCookie,
} from './helpers/listenHelpers';

import {
  convertFilterNodesToArray
} from './helpers/filtersHelpers';

import {
  Config,
  Client,
  User,
  EventName,
  PublicEventRequest,
  InternalEventRequest,
  IdsData,
  FiltersData,
} from './types';

import env = require('./env');

const uidKey = env.storage.uniqKey;
const sidKey = env.storage.visitKey;
const cartKey = env.storage.cartKey;

const readUid = () => storage.read(uidKey);
const readSid = () => storage.read(sidKey);
const writeUid = () => storage.write(uidKey, generateId(), true);
const writeSid = () => storage.write(sidKey, generateId());
const readCart = () => storage.read(cartKey);
const writeCart = (data) => storage.write(cartKey, data);

const init = (cfg: Config): Client => {
  const config = { ...cfg, platform: cfg.platform || {} };

  validateInitParams(config);

  const initialSid = readSid();
  const initialUid = readUid();
  let idsData = ({} as IdsData);
  let filtersData = ([] as FiltersData[]);

  if (!initialSid) writeSid();
  if (!initialUid) writeUid();

  return {
    getUser(): User {
      const uid = readUid();
      const sid = readSid();

      return {
        uid,
        sid,
        exist: !!(uid && sid),
        persist: !!(initialSid && initialUid)
      }
    },

    sendEvent(name: EventName, request?, endpoint?: string) {
      validateSendEventParams(name, request, config);

      const user = this.getUser();
      const { key } = config;

      if (!user.exist) return;

      const properties = name === 'view-page' ? {
        ...request,
        url: window.location.href,
        ref: window.document.referrer,
        width: window.screen.width,
        height: window.screen.height,
      } : request;

      return requestApi({
        key,
        user,
        properties: (cleanObject(properties) as InternalEventRequest),
        event: name,
      }, endpoint);
    },

    listen(context?) {
      const node = context || document;

      node.addEventListener('click', (e) => {
        const target = e.target;

        if (isEvent('click-suggestion', target)) {
          return writeClickThroughCookie('click-suggestion', getClickSuggestionData(target));
        }

        if (isEvent('click-item', target)) {
          return writeClickThroughCookie('click-item', getClickItemData(target));
        }
        
        if (isEvent('add-to-cart', target)) {
          return this.sendEvent('add-to-cart', getAddToCartData(target));
        }
      });

      if (!context) {
        const init = () => {
          const viewPageNode = getEventNode('view-page', node);
          const filterNodes = getFilterNodes(node);
          const purchaseNode = getEventNode('purchase', node);
          const updateCartNode = getEventNode('update-cart', node);
          const viewPageFallbackNode = node.querySelector('.findify_page_product');
          const purchaseFallbackNode = node.querySelector('.findify_purchase_order');

          const clickThroughCookie = readClickThroughCookie();
          const getItemsIds = (items) => items.map((item) => item.item_id);

          if (clickThroughCookie) {
            clearClickThroughCookie();

            const { type, request } = clickThroughCookie;

            this.sendEvent(type, request);
          }

          if (purchaseFallbackNode) {
            const data = getPurchaseFallbackData(purchaseFallbackNode);
            this.sendEvent('purchase', data,
              config.platform.bigcommerce ? env.bigcommerceTrackingUrl : void 0
            );
          }

          if (filterNodes.length) {
            filtersData = convertFilterNodesToArray(filterNodes);
          }

          if (isEvent('view-page', viewPageNode) || viewPageFallbackNode) {
            if (isEvent('view-page', viewPageNode)) {
              const viewPageData = getViewPageData(viewPageNode);

              idsData.item_id = viewPageData.item_id;

              this.sendEvent('view-page', viewPageData);
            }

            if (viewPageFallbackNode) {
              const viewPageData = getViewPageFallbackData(viewPageFallbackNode);

              idsData.item_id = viewPageData.item_id;

              this.sendEvent('view-page', viewPageData);
            }
          } else {
            this.sendEvent('view-page', {});
          }

          if (isEvent('purchase', purchaseNode)) {
            this.sendEvent('purchase', getPurchaseData(purchaseNode));
          }

          if (isEvent('update-cart', updateCartNode)) {
            const updateCartData = getUpdateCartData(updateCartNode);
            const itemsIds = getItemsIds(updateCartData.line_items);
            const storageCart = readCart();
            const isCartUpdated = !isEqual(storageCart, updateCartData);

            idsData.item_ids = itemsIds;

            if (isCartUpdated) {
              this.sendEvent('update-cart', updateCartData);
              writeCart(updateCartData);
            }
          }
        };

        if (['complete', 'loaded', 'interactive'].indexOf(document.readyState) > -1 && document.body) {
          init();
        } else {
          document.addEventListener('DOMContentLoaded', init, false);
        }
      }
    },

    getIdsData() {
      return idsData;
    },

    getFiltersData() {
      return filtersData;
    },

    writeClickThroughCookie,
  };
}

export {
  init,
}
