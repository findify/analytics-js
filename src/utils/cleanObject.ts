import * as reduce from 'lodash/reduce';
import * as assign from 'lodash/assign';
import * as isNull from 'lodash/isNull';

function cleanObject(obj: InputObject) {
  return reduce(obj, (acc: InputObject, value: any, key: string) => (
    typeof value === 'undefined' || isNull(value) ? (
      acc
    ) : (
      assign({}, acc, {
        [key]: value,
      })
    )
  ), {});
}

type InputObject = {
  [key: string]: any,
};

export {
  cleanObject,
}
