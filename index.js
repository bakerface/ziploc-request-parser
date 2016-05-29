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

exports = module.exports = function (req, res, next) {
  next();
};

exports.Error = function () {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
};

exports.ExpectedError = function (name, property, toBe) {
  exports.Error.call(this);

  this.name = name;
  this.message = 'Expected "' + property + '" ' + toBe;
  this.property = property;
  this.code = 400;
};

exports.UndefinedError = function (type, property) {
  exports.ExpectedError.call(this, type + 'UndefinedError', property,
    'to be defined');
};

exports.InconsistentError = function (type, property, values) {
  exports.ExpectedError.call(this, type + 'InconsistentError', property,
    'to be consistent');

  this.values = values;
};

function defined(value) {
  return typeof value !== 'undefined';
}

function get(property) {
  return function (object) {
    return object[property];
  };
}

function unique(value, index, array) {
  return array.indexOf(value) === index;
}

exports.getUnvalidated$FromRequest = function ($, request) {
  var name = $.toCamelCase();

  var containers = [
    request.params,
    request.query,
    request.headers,
    request.body
  ];

  var values = containers
    .filter(defined)
    .map(get(name))
    .filter(defined)
    .filter(unique);

  if (values.length === 0) {
    throw new exports.UndefinedError($, name);
  }

  if (values.length > 1) {
    throw new exports.InconsistentError($, name, values);
  }

  return values.pop();
};
