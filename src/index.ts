import * as has from 'lodash/has';

import * as storage from './modules/storage';
import { uuid } from './utils/uuid';
import { validateSendEventParams } from './validations';

import {
  Config,
  Client,
  User,
  EventName,
  EventRequest,
} from './types';

const env = require('./env');

function init(config: Config): Client {
  if (!has(config, 'key')) {
    throw new Error('"key" param is required');
  }

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
    sendEvent(name: EventName, request: EventRequest) {
      validateSendEventParams(name, request);

      if (name === 'click-suggestion') {
      }

      if (name === 'click-item') {
      }

      if (name === 'redirect') {
      }

      if (name === 'purchase') {
      }

      if (name === 'add-to-cart') {
      }

      if (name === 'update-cart') {
      }

      if (name === 'view-page') {
      }

      // set by default `url`, `width`, `height`, `ref` props in `view-page` event
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
