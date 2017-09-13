import isEqual = require('lodash/isEqual');
import defaults = require('lodash/defaults');
import once = require('lodash/once');

import { createChangeEmitter } from 'change-emitter';
import storage from './modules/storage';
import api from './modules/request';
import { validateSendEventParams, validateInitParams } from './validations';

import {
  getEventsOnPage,
  getDeprecatedEvents
} from './helpers/eventsHelpers';

import {
  getFiltersOnPage
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

const emitter = createChangeEmitter();
const state: any = {};

const getUser = () => ({
  uid: storage.uid,
  sid: storage.sid,
  persist: storage.persist,
  exist: storage.exist
});

const sendEventCreator = ({
  events,
  key,
}) => (
  event: string,
  request: any = {},
  useCookie?: boolean,
  endpoint?: string
) => {
  if (events[event] === false) return;

  if (useCookie) return storage.memoize(event, request);

  const properties = event === 'view-page' ? {
    ...request,
    url: window.location.href,
    ref: window.document.referrer,
    width: window.screen.width,
    height: window.screen.height,
  } : request;

  emitter.emit(event, properties);

  return api.request({ key, event, properties, user: getUser() }, endpoint)
};


const initializeCreator = (root, sendEvent, { platform }) => (context = root) => {
  state.events = {
    ...getDeprecatedEvents(context),
    ...getEventsOnPage(context),
    ...storage.memorized
  };

  state.filters = getFiltersOnPage(context);

  if (!state.events['view-page']) {
    sendEvent('view-page', {})
  }

  return Object.keys(state.events).forEach((key: string) => {
    let endpoint;
    if (key === 'update-cart' && isEqual(state.events[key], storage.cart)) return;
    if (key === 'purchase' && platform.bigcommerce) endpoint = env.bigcommerceTrackingUrl;
    return sendEvent(key, state.events[key], false, endpoint);
  });
};

export default (cfg: Config, context = document): Client => {
  const config = defaults({ events: {}, platform: {} }, cfg);
  const sendEvent = sendEventCreator(config);
  const init = initializeCreator(context, sendEvent, config);
  return {
    sendEvent,
    init,
    listen: emitter.listen,
    get user(): User { return getUser() },
    get state(): any { return state; }
  };
}
