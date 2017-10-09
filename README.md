# Getting started

## Dependencies

```
sudo apt-get install libcairo2-dev libjpeg-dev libgif-dev
```

or on Mac OS with Homebrew:

```
brew install cairo
```

## Installation
```
npm install findify-analytics --save
```
or
```
yarn add findify-analytics
```
Alternatively, you can use UMD builds, by requiring them to the page using `<script>` tag:
```
https://findify-assets-2bveeb6u8ag.netdna-ssl.com/analytics-js/findify-analytics.2.0.14.min.js
```
or using unminified version:
```
https://findify-assets-2bveeb6u8ag.netdna-ssl.com/analytics-js/findify-analytics.2.0.14.js
```

## Usage example

```javascript
var findifyAnalytics = require('@findify/analytics');

// First, you need to initialize library:
var client = findifyAnalytics({
  key: 'your_api_key',
});

// Then, you should initialize client instance.
// Usually you want to do this on document ready event to collect all data from HTML tags.
client.initialize();

// To access events on the page you can use `client.state`,
// Analytics state represents all events that was defined on the page
// before findify

// After library initialized, we can send event requests to server with `client` instance. Let's perform click-suggestion request:
client.sendEvent('click-suggestion', {
  rid: 'request_id',
  suggestion: 'Black t-shirt'
});

// You can listen for events with `listen` function
var unsubscribe = client.listen(function(event, payload) {
  console.log(event); // outputs event name
  console.log(payload); // outputs event payload
});

// Also, you can get `user` instance, which can be used further in `@findify/sdk` library:
var user = client.user;
```

# Documentation
- [API Reference](https://findify.readme.io/reference#analytics-js-introduction)

# License
MIT
