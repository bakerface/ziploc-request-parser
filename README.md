# ziploc-request-parser
[![npm package](https://badge.fury.io/js/ziploc-request-parser.svg)](http://badge.fury.io/js/ziploc-request-parser)
[![build](https://travis-ci.org/bakerface/ziploc-request-parser.svg?branch=master)](https://travis-ci.org/bakerface/ziploc-request-parser)
[![code climate](https://codeclimate.com/github/bakerface/ziploc-request-parser/badges/gpa.svg)](https://codeclimate.com/github/bakerface/ziploc-request-parser)
[![coverage](https://codeclimate.com/github/bakerface/ziploc-request-parser/badges/coverage.svg)](https://codeclimate.com/github/bakerface/ziploc-request-parser/coverage)
[![issues](https://img.shields.io/github/issues/bakerface/ziploc-request-parser.svg)](https://github.com/bakerface/ziploc-request-parser/issues)
[![dependencies](https://david-dm.org/bakerface/ziploc-request-parser.svg)](https://david-dm.org/bakerface/ziploc-request-parser)
[![devDependencies](https://david-dm.org/bakerface/ziploc-request-parser/dev-status.svg)](https://david-dm.org/bakerface/ziploc-request-parser#info=devDependencies)
[![downloads](http://img.shields.io/npm/dm/ziploc-request-parser.svg)](https://www.npmjs.com/package/ziploc-request-parser)

This package provides an extension to ziploc and express to parse requests.

``` javascript
var ziploc = require('ziploc');
var express = require('express');
var requestParser = require('ziploc-request-parser');

var zip = ziploc
  .use(requestParser)
  .use({
    getUsernameFromUnvalidatedUsername: function (username) {
      // todo: do your input validation here
      return username;
    }
  });

var app = express();
app.use(requestParser);

app.get('/users/:username', zip.express().status(200).json({
  username: 'Username'
}));

app.listen(process.env.PORT || 3000);
```
