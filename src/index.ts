import * as has from 'lodash/has';
import * as storage from './modules/storage';

import { requestApi } from './modules/requestApi';
import { generateId } from './utils/generateId';
import { validateSendEventParams, validateInitParams } from './validations';

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

  if (!readSid()) {
    writeSid();
  }

  if (!readUid()) {
    writeUid();
  }

  return {
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

      if (name === 'click-suggestion') {
        requestApi({
          key,
          user,
          event: 'click-suggestion',
          properties: {
            rid: request.rid,
            suggestion: request.suggestion,
          },
        });
      }

      if (name === 'click-item') {
        requestApi({
          key,
          user,
          event: 'click-item',
          properties: {
            rid: request.rid,
            item_id: request.item_id,
          },
        });
      }

      if (name === 'redirect') {
        requestApi({
          key,
          user,
          event: 'redirect',
          properties: {
            rid: request.rid,
            suggestion: request.suggestion,
          },
        });
      }

      if (name === 'purchase') {
        requestApi({
          key,
          user,
          event: 'purchase',
          properties: {
            order_id: request.order_id,
            currency: request.currency,
            revenue: request.revenue,
            line_items: request.line_items,
            affiliation: request.affiliation,
          },
        });
      }

      if (name === 'add-to-cart') {
        requestApi({
          key,
          user,
          event: 'add-to-cart',
          properties: {
            rid: request.rid,
            item_id: request.item_id,
            quantity: request.quantity,
          },
        });
      }

      if (name === 'update-cart') {
        requestApi({
          key,
          user,
          event: 'update-cart',
          properties: {
            line_items: request.line_items,
          },
        });
      }

      if (name === 'view-page') {
        requestApi({
          key,
          user,
          event: 'view-page',
          properties: {
            ...request,
            url: window.location.href,
            ref: window.document.referrer,
            width: window.screen.width,
            height: window.screen.height,
          },
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
