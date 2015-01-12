define(function (require) {
  var _ = require('lodash');
  return function (nestedObj) {
    var key; // original key
    var stack = []; // track key stack
    var flatObj = {};
    var inArray = false;
    var self = this;
    (function flattenObj(obj) {
      _.keys(obj).forEach(function (key) {
        if (!_.isArray(obj))
          stack.push(key);
        var flattenKey = stack.join('.');

        if ((self.fields.byName[flattenKey] || !_.isObject(obj[key]))) {
          if (inArray) {
            if (!flatObj[flattenKey])
              flatObj[flattenKey] = [];
            flatObj[flattenKey] = flatObj[flattenKey].concat(obj[key]);
          } else {
            flatObj[flattenKey] = obj[key];
          }
        } else if (_.isArray(obj[key])) {
          var prev = inArray;
          inArray = true;
          flattenObj(obj[key]);
          inArray = prev;
        } else if (_.isObject(obj[key])) {
          flattenObj(obj[key]);
        }

        if (!_.isArray(obj))
          stack.pop();
      });
    }(nestedObj));
    return flatObj;
  };
});
