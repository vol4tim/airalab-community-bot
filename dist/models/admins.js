'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onRemove = exports.onUpdate = exports.onAdd = exports.byName = exports.clear = exports.remove = exports.add = exports.update = undefined;

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ref = _db2.default.ref('admins');
exports.default = ref;
var update = exports.update = function update(key, username) {
  var userId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return _db2.default.ref('admins/' + key).set({
    username: username,
    userId: userId
  });
};

var add = exports.add = function add(username) {
  var key = ref.push().key;
  update(key, username);
  return key;
};

var remove = exports.remove = function remove(key) {
  return _db2.default.ref('admins/' + key).remove();
};

var clear = exports.clear = function clear() {
  ref.remove();
};

var byName = exports.byName = function byName(username) {
  return ref.orderByChild("username").equalTo(username).once('value');
};

var onAdd = exports.onAdd = function onAdd(cb) {
  _db2.default.ref('admins').on('child_added', function (data) {
    cb(data.key, data.val());
  });
};

var onUpdate = exports.onUpdate = function onUpdate(cb) {
  _db2.default.ref('admins').on('child_changed', function (data) {
    cb(data.key, data.val());
  });
};

var onRemove = exports.onRemove = function onRemove(cb) {
  _db2.default.ref('admins').on('child_removed', function (data) {
    cb(data.key);
  });
};