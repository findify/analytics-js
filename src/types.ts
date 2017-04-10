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

type ClickSuggestionPublicEventRequest = {
  rid: string,
  suggestion: string,
};
type ClickItemPublicEventRequest = {
  item_id: string,
  rid?: string,
};
type RedirectPublicEventRequest = {
  rid: string,
  suggestion: string,
};
type PurchasePublicEventRequest = {
  order_id: string,
  currency: string,
  revenue: number,
  line_items: LineItemData[],
  affiliation?: string,
};
type UpdateCartPublicEventRequest = {
  line_items: LineItemData[],
};
type AddToCartPublicEventRequest = {
  item_id: string,
  rid?: string,
  quantity?: number,
};
type ViewPagePublicEventRequest = {
  item_id?: string,
};

type ClickSuggestionInternalEventRequest = ClickSuggestionPublicEventRequest;
type ClickItemInternalEventRequest = ClickItemPublicEventRequest;
type RedirectInternalEventRequest = RedirectPublicEventRequest;
type PurchaseInternalEventRequest = PurchasePublicEventRequest;
type UpdateCartInternalEventRequest = UpdateCartPublicEventRequest;
type AddToCartInternalEventRequest = AddToCartPublicEventRequest;
type ViewPageInternalEventRequest = ViewPagePublicEventRequest & {
  url: string,
  ref: string
  width: number,
  height: number,
};

type PublicEventRequest = (
  ClickSuggestionPublicEventRequest |
  ClickItemPublicEventRequest |
  RedirectPublicEventRequest |
  PurchasePublicEventRequest |
  UpdateCartPublicEventRequest |
  AddToCartPublicEventRequest |
  ViewPagePublicEventRequest
);

type InternalEventRequest = (
  ClickSuggestionInternalEventRequest |
  ClickItemInternalEventRequest |
  RedirectInternalEventRequest |
  PurchaseInternalEventRequest |
  UpdateCartInternalEventRequest |
  AddToCartInternalEventRequest |
  ViewPageInternalEventRequest
);

type IdsData = {
  item_id?: string,
  item_ids?: string[],
};

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
  sendEvent(name: 'click-suggestion', request: ClickSuggestionPublicEventRequest),
  sendEvent(name: 'click-item', request: ClickItemPublicEventRequest),
  sendEvent(name: 'redirect', request: RedirectPublicEventRequest),
  sendEvent(name: 'purchase', request: PurchasePublicEventRequest),
  sendEvent(name: 'add-to-cart', request: AddToCartPublicEventRequest),
  sendEvent(name: 'update-cart', request: UpdateCartPublicEventRequest),
  sendEvent(name: 'view-page', request?: ViewPagePublicEventRequest),
  listen(context?): void,
  getIdsData(): IdsData,
  writeClickThroughCookie(type: string, request: any): void,
  isUserPersist: boolean,
};

export {
  User,
  Config,
  Client,
  EventName,
  PublicEventRequest,
  InternalEventRequest,
  IdsData,

  ClickSuggestionPublicEventRequest,
  ClickItemPublicEventRequest,
  RedirectPublicEventRequest,
  PurchasePublicEventRequest,
  UpdateCartPublicEventRequest,
  AddToCartPublicEventRequest,
  ViewPagePublicEventRequest
}
