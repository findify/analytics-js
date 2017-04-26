import * as qs from 'qs';
import { User, EventName, InternalEventRequest } from '../types';

import env = require('../env');

function requestApi(data: Data, endpoint?: string) {
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

    image.src = makeSrc(queryString, endpoint);
  });
}

function makeSrc(queryString: string, endpoint?: string) {
  return !endpoint ? (
    env.searchApi.url + '/feedback?' + queryString
  ) : (
    endpoint + '?' + queryString
  );
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
