import * as has from 'lodash/has';
import * as storage from './modules/storage';

import { requestApi } from './modules/requestApi';
import { generateId } from './utils/generateId';
import { cleanObject } from './utils/cleanObject';
import { validateSendEventParams, validateInitParams } from './validations';

import {
  isEvent,
  getEventNode,
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
  Config,
  Client,
  User,
  EventName,
  PublicEventRequest,
  InternalEventRequest,
  IdsData,
} from './types';

import env = require('./env');

function init(config: Config): Client {
  validateInitParams(config);

  const initialSid = readSid();
  const initialUid = readUid();
  let idsData = ({} as IdsData);

  if (!initialSid) {
    writeSid();
  }

  if (!initialUid) {
    writeUid();
  }

  return {
    isUserPersist: !!(initialSid && initialUid),

    getUser(): User {
      const uid = readUid();
      const sid = readSid();

      return uid && sid ? { uid, sid } : undefined;
    },

    sendEvent(name: EventName, request?) {
      validateSendEventParams(name, request);

      const user = this.getUser();
      const { key } = config;

      if (!user) {
        return;
      }

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
        properties: (cleanObject(properties)) as InternalEventRequest,
        event: name,
      });
    },

    listen(context?) {
      const node = context || window.document;

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
          const viewPageNode = getEventNode('view-page', window.document);
          const purchaseNode = getEventNode('purchase', window.document);
          const updateCartNode = getEventNode('update-cart', window.document);
          const viewPageFallbackNode = document.querySelector('.findify_page_product');
          const purchaseFallbackNode = document.querySelector('.findify_purchase_order');
          const clickThroughCookie = readClickThroughCookie();
          const getItemsIds = (items) => items.map((item) => item.item_id);

          if (clickThroughCookie) {
            clearClickThroughCookie();

            const { type, request } = clickThroughCookie;

            this.sendEvent(type, request);
          }

          if (viewPageFallbackNode) {
            this.sendEvent('view-page', getViewPageFallbackData(viewPageFallbackNode));
          }

          if (purchaseFallbackNode) {
            this.sendEvent('purchase', getPurchaseFallbackData(purchaseFallbackNode));
          }

          if (isEvent('view-page', viewPageNode)) {
            const viewPageData = getViewPageData(viewPageNode);

            idsData.item_id = viewPageData.item_id;

            this.sendEvent('view-page', viewPageData);
          }

          if (isEvent('purchase', purchaseNode)) {
            this.sendEvent('purchase', getPurchaseData(purchaseNode));
          }

          if (isEvent('update-cart', updateCartNode)) {
            const updateCartData = getUpdateCartData(updateCartNode);
            const itemsIds = getItemsIds(updateCartData.line_items);

            idsData.item_ids = itemsIds;

            this.sendEvent('update-cart', updateCartData);
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

    writeClickThroughCookie,
  };
}

const uidKey = env.storage.uniqKey;
const sidKey = env.storage.visitKey;

const readUid = () => storage.read(uidKey);
const readSid = () => storage.read(sidKey);
const writeUid = () => storage.write(uidKey, generateId(), true);
const writeSid = () => storage.write(sidKey, generateId());

export {
  init,
}
