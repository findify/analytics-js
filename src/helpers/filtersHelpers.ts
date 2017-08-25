const NAME_SELECTOR = 'data-findify-filter';
const VALUE_SELECTOR = 'data-findify-filter-value';

import { FiltersData } from '../types';

const convertFilterNodesToArray = (nodes): FiltersData[] => {
  return Array.prototype.slice.call(nodes)
  .map(node => {
    const name = node.getAttribute(NAME_SELECTOR);
    const value = node.getAttribute(VALUE_SELECTOR);
    let values = void 0;

    try {
      values = JSON.parse(value);
    } catch(e) {
      values = [{ value: value.split(/,|>/).map(v => v && v.trim()) }];
    }

    return { name, values };
  })
  .filter(i => !!i);
}

export {
  convertFilterNodesToArray
}
