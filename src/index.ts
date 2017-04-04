import * as has from 'lodash/has';
import * as storage from './modules/storage';

import { requestApi } from './modules/requestApi';
import { generateId } from './utils/generateId';
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
} from './types';

import env = require('./env');

function init(config: Config): Client {
  validateInitParams(config);

  const initialSid = readSid();
  const initialUid = readUid();

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

      requestApi({
        key,
        user,
        properties,
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
        window.document.addEventListener('DOMContentLoaded', () => {
          const viewPageNode = getEventNode('view-page', window.document);
          const purchaseNode = getEventNode('purchase', window.document);
          const updateCartNode = getEventNode('update-cart', window.document);
          const viewPageFallbackNode = document.querySelector('.findify_page_product');
          const purchaseFallbackNode = document.querySelector('.findify_purchase_order');
          const clickThroughCookie = readClickThroughCookie();

          if (clickThroughCookie) {
            clearClickThroughCookie();

            const { type, request } = clickThroughCookie;

            return this.sendEvent(type, request);
          }

          if (viewPageFallbackNode) {
            return this.sendEvent('view-page', getViewPageFallbackData(viewPageFallbackNode));
          }

          if (purchaseFallbackNode) {
            return this.sendEvent('purchase', getPurchaseFallbackData(purchaseFallbackNode));
          }

          if (isEvent('view-page', viewPageNode)) {
            return this.sendEvent('view-page', getViewPageData(viewPageNode));
          }

          if (isEvent('purchase', purchaseNode)) {
            return this.sendEvent('purchase', getPurchaseData(purchaseNode));
          }

          if (isEvent('update-cart', updateCartNode)) {
            return this.sendEvent('update-cart', getUpdateCartData(updateCartNode));
          }
        });
      }
    },
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
