const NAME_SELECTOR = 'data-findify-filter';
const VALUE_SELECTOR = 'data-findify-filter-value';

import { FiltersData } from '../types';

const convertFilterNodesToArray = (nodes): FiltersData[] => {
  return Array.prototype.slice.call(nodes)
  .map(node => {
    const name = node.getAttribute(NAME_SELECTOR);
    const value = node.getAttribute(VALUE_SELECTOR);
    try {
      JSON.parse(value);
    } catch(e) {
      console.error(`Please provide a valid JSON object to ${VALUE_SELECTOR}`);
      return void 0;
    }

    return { name, values: JSON.parse(value) };
  })
  .filter(i => !!i);
}

export {
  convertFilterNodesToArray
}
