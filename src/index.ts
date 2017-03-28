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
