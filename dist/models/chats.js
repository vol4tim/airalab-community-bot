'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onRemove = exports.onUpdate = exports.onAdd = exports.getChats = exports.clear = exports.remove = exports.add = exports.update = undefined;

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ref = _db2.default.ref('chats');
exports.default = ref;
var update = exports.update = function update(key, chatId, name) {
  return _db2.default.ref('chats/' + key).set({
    chatId: chatId,
    name: name
  });
};

var add = exports.add = function add(chatId, name) {
  var key = chatId;
  update(key, chatId, name);
  return key;
};

var remove = exports.remove = function remove(key) {
  return _db2.default.ref('chats/' + key).remove();
};

var clear = exports.clear = function clear() {
  ref.remove();
};

var getChats = exports.getChats = function getChats() {
  return ref.once('value');
};

var onAdd = exports.onAdd = function onAdd(cb) {
  ref.on('child_added', function (data) {
    cb(data.key, data.val());
  });
};

var onUpdate = exports.onUpdate = function onUpdate(cb) {
  ref.on('child_changed', function (data) {
    cb(data.key, data.val());
  });
};

var onRemove = exports.onRemove = function onRemove(cb) {
  ref.on('child_removed', function (data) {
    cb(data.key);
  });
};