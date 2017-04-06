import { readCookie, writeCookie } from '../modules/storage';
import env = require('../env');

const isEvent = (name, node) => node && node.getAttribute('data-findify-event') === name;
const getEventNode = (name, context) => context.querySelector(`[data-findify-event="${name}"]`);

const getClickSuggestionData = (node) => ({
  suggestion: node.getAttribute('data-findify-suggestion'),
  rid: node.getAttribute('data-findify-rid'),
});
const getClickItemData = (node) => ({
  item_id: node.getAttribute('data-findify-item-id'),
  variant_item_id: node.getAttribute('data-findify-variant-item-id'),
  rid: node.getAttribute('data-findify-rid'),
});
const getAddToCartData = (node) => ({
  item_id: node.getAttribute('data-findify-item-id'),
  variant_item_id: node.getAttribute('data-findify-variant-item-id'),
  rid: node.getAttribute('data-findify-rid'),
  quantity: node.getAttribute('data-findify-quantity'),
});
const getViewPageData = (node) => ({
  item_id: node.getAttribute('data-findify-item-id'),
  variant_item_id: node.getAttribute('data-findify-variant-item-id'),
});
const getPurchaseData = (node) => ({
  order_id: node.getAttribute('data-findify-order-id'),
  currency: node.getAttribute('data-findify-currency'),
  revenue: node.getAttribute('data-findify-revenue'),
  affiliation: node.getAttribute('data-findify-affiliation'),
  line_items: getLineItemsData(node.children),
});
const getUpdateCartData = (node) => ({
  line_items: getLineItemsData(node.children),
});
const getLineItemsData = (nodeList) => Array.prototype.slice.call(nodeList).map((element) => ({
  item_id: element.getAttribute('data-findify-item-id'),
  variant_item_id: element.getAttribute('data-findify-variant-item-id'),
  unit_price: element.getAttribute('data-findify-unit-price'),
  quantity: element.getAttribute('data-findify-quantity'),
}));
const getViewPageFallbackData = (node) => ({
  item_id: node.innerHTML,
});
const getPurchaseFallbackData = (node) => {
  const orderIdNode = node.querySelector('.order_number');
  const currencyNode = node.querySelector('.price_currency_code');
  const lineItems = Array.prototype.slice.call(node.querySelectorAll('.line_item')).map((element) => {
    const itemIdNode = element.querySelector('.product_id');
    const unitPriceNode = element.querySelector('.unit_price');
    const quantityNode = element.querySelector('.quantity');

    return {
      item_id: itemIdNode && itemIdNode.innerHTML,
      unit_price: unitPriceNode && unitPriceNode.innerHTML,
      quantity: quantityNode && quantityNode.innerHTML,
    };
  });

  return {
    order_id: orderIdNode && orderIdNode.innerHTML,
    currency: currencyNode && currencyNode.innerHTML,
    revenue: lineItems.reduce((amount, { unit_price }) => amount + parseFloat(unit_price), 0),
    line_items: lineItems,
  };
};

const writeClickThroughCookie = (type, request) => {
  writeCookie(3E4, env.storage.ctKey, `${type}#${JSON.stringify(request)}`);
};

const readClickThroughCookie = () => {
  const data = readCookie(env.storage.ctKey);

  if (!data) {
    return;
  }

  const [type, requestString] = data.split('#');

  return {
    type,
    request: JSON.parse(requestString),
  };
};

const clearClickThroughCookie = () => {
  writeCookie(0, env.storage.ctKey);
};

export {
  isEvent,
  getEventNode,
  getClickSuggestionData,
  getClickItemData,
  getAddToCartData,
  getViewPageData,
  getPurchaseData,
  getUpdateCartData,
  getLineItemsData,
  getViewPageFallbackData,
  getPurchaseFallbackData,
  writeClickThroughCookie,
  readClickThroughCookie,
  clearClickThroughCookie,
}
