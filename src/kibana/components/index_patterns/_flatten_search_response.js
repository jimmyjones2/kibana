define(function (require) {
  var _ = require('lodash');
  return function (nestedObj) {
    var key; // original key
    var stack = []; // track key stack
    var flatObj = {};
    var self = this;
    (function flattenObj(obj) {
      _.keys(obj).forEach(function (key) {
        if (!_.isArray(obj))
          stack.push(key);
        var flattenKey = stack.join('.');

        if ((self.fields.byName[flattenKey] || !_.isObject(obj[key]))) {
          if( !flatObj[flattenKey] ) {
            flatObj[flattenKey] = obj[key];
          } else if( _.isArray(flatObj[flattenKey])) {
            if( _.isArray(obj[key]) ) {
              flatObj[flattenKey] = flatObj[flattenKey].concat(obj[key]);
            } else {
              flatObj[flattenKey].push(obj[key]);
            }
          } else {
            flatObj[flattenKey] = [ flatObj[flattenKey], obj[key] ];
          }
        } else if (_.isArray(obj[key])) {
          if (_.isObject(obj[key][0]) || _.isArray(obj[key][0])) {
            flattenObj(obj[key]);
          } else {
            // Not sure when this is reached!
            // FIXME: modify like above
            flatObj[flattenKey] = obj[key];
          }
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
