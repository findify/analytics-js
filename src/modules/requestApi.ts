import * as qs from 'qs';
import { User, EventName, InternalEventRequest } from '../types';

import env = require('../env');

function requestApi(data: Data) {
  return new Promise((resolve, reject) => {
    const queryString = qs.stringify({
      ...data,
      t_client: Date.now(),
    });
    const image = window.document.createElement('img');

    image.onload = () => {
      resolve();
    };

    image.onerror = () => {
      resolve();
    };

    image.src = makeSrc(queryString);
  });
}

function makeSrc(queryString: string) {
  return env.searchApi.url + '/feedback?' + queryString;
}

type Data = {
  key: string,
  user: User,
  event: EventName,
  properties: InternalEventRequest,
};

export {
  requestApi,
};
