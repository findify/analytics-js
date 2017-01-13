import * as qs from 'qs';
import { User, EventName, InternalEventRequest } from '../types';

import env = require('../env');

function requestApi(data: Data) {
  const queryString = qs.stringify(data);
  const image = window.document.createElement('img');

  image.src = makeSrc(queryString);
}

function makeSrc(queryString: string) {
  return env.searchApi.url + '/feedback?' + queryString;
}

type Data = {
  user: User,
  event: EventName,
  properties: InternalEventRequest,
};

export {
  requestApi,
};
