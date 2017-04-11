import * as reduce from 'lodash/reduce';
import * as assign from 'lodash/assign';

function cleanObject(obj: InputObject) {
  return reduce(obj, (acc: InputObject, value: any, key: string) => (
    typeof value === 'undefined' ? (
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
