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
link to minified UMD build
```
or using unminified version:
```
link to unminified UMD build
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
