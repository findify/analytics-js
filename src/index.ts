import * as has from 'lodash/has';
import * as storage from './modules/storage';

import { requestApi } from './modules/requestApi';
import { uuid } from './utils/uuid';
import { validateSendEventParams, validateInitParams } from './validations';

import {
  Config,
  Client,
  User,
  EventName,
  PublicEventRequest,
} from './types';

const env = require('./env');

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
      return {
        uid: readUid(),
        sid: readSid(),
      };
    },
    sendEvent(name: EventName, request: PublicEventRequest) {
      validateSendEventParams(name, request);

      const user = this.getUser();

      if (name === 'click-suggestion') {
        requestApi({
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
          user,
          event: 'purchase',
          properties: {
            line_items: request.line_items,
          },
        });
      }

      if (name === 'view-page') {
        requestApi({
          user,
          event: 'view-page',
          properties: {
            url: window.location.href,
            ref: window.document.referrer,
            width: window.screen.width,
            height: window.screen.height,
            item_id: request.item_id,
          },
        });
      }
    },
  };
}

const sidKey = storage.read(env.storage.visitKey);
const uidKey = storage.read(env.storage.uniqKey);

const readUid = () => storage.read(uidKey);
const readSid = () => storage.read(sidKey);
const writeUid = () => storage.write(uidKey, uuid(16), true);
const writeSid = () => storage.write(sidKey, uuid(16));

export {
  init,
}
