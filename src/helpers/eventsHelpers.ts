import * as storage from '../modules/storage';
import mapKeys = require('lodash/mapKeys');
import { decamelize } from 'humps';
import env = require('../env');

const nodeToArray = node => Array.prototype.slice.call(node);

const normalizeKeys = (obj = {}): any => mapKeys(obj,
  (_, key) => decamelize(key, { separator: '_' }).replace('findify_', '')
);

const getPropsFromChildren = nodeList => nodeToArray(nodeList).reduce((acc, element) => ({
  ...acc,
  ...normalizeKeys(element.dataset),
  ...(!element.className && {} || {
    [element.className]: !!element.innerHTML
    ? (acc[element.className] || []).push(getPropsFromChildren(element.children))
    : element.innerText
  })
}), {});

export const getEventsOnPage = root => nodeToArray(root.querySelectorAll('[data-findify-event]'))
  .map(node => {
    const { event, ...ownProps } = normalizeKeys(node.dataset);
    const childrenProps = getPropsFromChildren(node.children);
    const props = { ...ownProps, ...childrenProps };
    return props;
  });

export const getDeprecatedEvents = root => {
  const events = {};
  const pageViewNode = root.querySelector('.findify_page_product');
  const purchaseNode = root.querySelector('.findify_purchase_order');

  if (!!pageViewNode) {
    events['page-view'] = {
      item_id: pageViewNode.innerHTML
    }
  }

  if (!!pageViewNode){
    const { line_item, ...data } = getPropsFromChildren(purchaseNode.children);
    events['purchase'] = {
      ...data,
      line_item: line_item,
      revenue: data.line_item && data.line_item.length &&
        data.line_item.reduce((amount, { unit_price }) => amount + parseFloat(unit_price), 0)
    }
  }

  return events;
}
