'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onRemove = exports.onUpdate = exports.onAdd = exports.clear = exports.remove = exports.add = exports.update = undefined;

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ref = _db2.default.ref('users');
exports.default = ref;
var update = exports.update = function update(chatId, userId, username) {
  return _db2.default.ref('users/' + chatId + '/' + userId).set(username);
};

var add = exports.add = function add(chatId, userId, username) {
  update(chatId, userId, username);
};

var remove = exports.remove = function remove(chatId, userId) {
  return _db2.default.ref('users/' + chatId + '/' + userId).remove();
};

var clear = exports.clear = function clear() {
  ref.remove();
};

var onAdd = exports.onAdd = function onAdd(chatId, cb) {
  _db2.default.ref('users/' + chatId).on('child_added', function (data) {
    cb(data.key, data.val());
  });
};

var onUpdate = exports.onUpdate = function onUpdate(chatId, cb) {
  _db2.default.ref('users/' + chatId).on('child_changed', function (data) {
    cb(data.key, data.val());
  });
};

var onRemove = exports.onRemove = function onRemove(chatId, cb) {
  _db2.default.ref('users/' + chatId).on('child_removed', function (data) {
    cb(data.key);
  });
};