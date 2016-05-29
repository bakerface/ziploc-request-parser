/**
 * Copyright (c) 2016 Christopher M. Baker
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

var bodyParser = require('body-parser');
var express = require('express');
var supertest = require('supertest');
var ziploc = require('ziploc');
var extension = require('..');

describe('ziploc-request-parser', function () {
  var app;
  var zip;

  beforeEach(function () {
    app = express();
    zip = ziploc.use(extension).express();

    app.use(bodyParser.json());
    app.use(extension);

    app.get('/', zip.status(200).json('UnvalidatedUsername'));
    app.post('/', zip.status(200).json('UnvalidatedUsername'));
    app.get('/:username', zip.status(200).json('UnvalidatedUsername'));

    app.use(function (err, req, res, _next) {
      res.status(err.code).json(err);
    });
  });

  it('should be usable by express', function (done) {
    supertest(app)
      .get('/not/found')
      .expect(404, done);
  });

  it('should resolve path parameters', function (done) {
    supertest(app)
      .get('/john')
      .expect(200, '"john"', done);
  });

  it('should resolve query parameters', function (done) {
    supertest(app)
      .get('/?username=john')
      .expect(200, '"john"', done);
  });

  it('should resolve headers', function (done) {
    supertest(app)
      .get('/')
      .set('Username', 'john')
      .expect(200, '"john"', done);
  });

  it('should resolve properties', function (done) {
    supertest(app)
      .post('/')
      .send({
        username: 'john'
      })
      .expect(200, '"john"', done);
  });

  it('should throw undefined errors', function (done) {
    supertest(app)
      .get('/')
      .expect(400, {
        code: 400,
        name: 'UsernameUndefinedError',
        message: 'Expected "username" to be defined',
        property: 'username'
      }, done);
  });

  it('should throw inconsistent errors', function (done) {
    supertest(app)
      .post('/?username=john')
      .send({
        username: 'jane'
      })
      .expect(400, {
        code: 400,
        name: 'UsernameInconsistentError',
        message: 'Expected "username" to be consistent',
        property: 'username',
        values: ['john', 'jane']
      }, done);
  });
});
