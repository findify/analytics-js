type User = {
  uid: string,
  sid: string,
};
type Config = {
  key: string,
};

type LineItemData = {
  item_id: string,
  unit_price: number,
  quantity: number,
};

type ClickSuggestionEventRequest = {
  rid: string,
  suggestion: string,
};
type ClickItemEventRequest = {
  item_id: string,
  rid?: string,
};
type RedirectEventRequest = {
  rid: string,
  suggestion: string,
};
type PurchaseEventRequest = {
  order_id: string,
  currency: string,
  revenue: number,
  line_items: LineItemData[],
  affiliation?: string,
};
type UpdateCartEventRequest = {
  line_items: LineItemData[],
};
type AddToCartEventRequest = {
  item_id: string,
  rid?: string,
  quantity?: number,
};
type ViewPageEventRequest = {
  item_id?: string,
};

type EventRequest = (
  ClickSuggestionEventRequest |
  ClickItemEventRequest |
  RedirectEventRequest |
  PurchaseEventRequest |
  UpdateCartEventRequest |
  AddToCartEventRequest |
  ViewPageEventRequest
);

type EventName = (
  'click-suggestion' |
  'click-item' |
  'redirect' |
  'purchase' |
  'add-to-cart' |
  'update-cart' |
  'view-page'
);

type Client = {
  getUser(): User,
  sendEvent(name: 'click-suggestion', request: ClickSuggestionEventRequest),
  sendEvent(name: 'click-item', request: ClickItemEventRequest),
  sendEvent(name: 'redirect', request: RedirectEventRequest),
  sendEvent(name: 'purchase', request: PurchaseEventRequest),
  sendEvent(name: 'add-to-cart', request: AddToCartEventRequest),
  sendEvent(name: 'update-cart', request: UpdateCartEventRequest),
  sendEvent(name: 'view-page', request: ViewPageEventRequest),
};

export {
  User,
  Config,
  Client,
  EventRequest,
  EventName,

  ClickSuggestionEventRequest,
  ClickItemEventRequest,
  RedirectEventRequest,
  PurchaseEventRequest,
  UpdateCartEventRequest,
  AddToCartEventRequest,
  ViewPageEventRequest
}
