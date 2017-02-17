# Getting started
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
https://s3.amazonaws.com/findify-assets/analytics-js/findify-analytics.1.1.2.min.js
```
or using unminified version:
```
https://s3.amazonaws.com/findify-assets/analytics-js/findify-analytics.1.1.2.js
```

## Usage example
```javascript
var FindifyAnalytics = require('findify-analytics');

// First, you need to initialize library:
var client = FindifyAnalytics.init({
  key: 'your_api_key',
});

// After library initialized, we can send event requests to server with `client` instance. Let's perform click-suggestion request:
client.sendEvent('click-suggestion', {
  rid: 'request_id',
  suggestion: 'Black t-shirt'
});

// Also, you can get `user` instance, which can be used further in `findify-sdk` library:
var user = client.getUser();
```

# Documentation
- [API Reference](https://findify.readme.io/reference#analytics-js-introduction)

# License
MIT
