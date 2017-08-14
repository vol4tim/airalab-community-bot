'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

var _bot = require('./bot');

var _bot2 = _interopRequireDefault(_bot);

var _chats = require('./models/chats');

var chats = _interopRequireWildcard(_chats);

var _tasks = require('./models/tasks');

var tasks = _interopRequireWildcard(_tasks);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var botUsername = '';
_bot2.default.getMe().then(function (result) {
  botUsername = result.username;
});

_bot2.default.onText(/\/start/, function (msg) {
  chats.add(msg.chat.id, '@' + msg.chat.username + ' ' + msg.chat.first_name + ' ' + msg.chat.last_name);
});

_bot2.default.on('message', function (msg) {
  if (_lodash2.default.has(msg, 'new_chat_member') && msg.new_chat_member.username === botUsername) {
    chats.add(msg.chat.id, msg.chat.title);
  }
});

var send = function send(data) {
  if (data.chatId === '') {
    return chats.getChats().then(function (list) {
      list.forEach(function (item) {
        var chat = item.val();
        _bot2.default.sendMessage(chat.chatId, data.text);
      });
    });
  } else {
    _bot2.default.sendMessage(data.chatId, data.text);
  }
  return _bluebird2.default.resolve();
};

var cronTasks = {};

tasks.onAdd(function (id, data) {
  if (data.time === '') {
    send(data).then(function () {
      tasks.remove(id);
    });
  } else {
    cronTasks[id] = _nodeCron2.default.schedule(data.time, function () {
      send(data);
    });
  }
});

tasks.onRemove(function (id) {
  if (_lodash2.default.has(cronTasks, id)) {
    cronTasks[id].destroy();
    cronTasks = _lodash2.default.omit(cronTasks, id);
  }
});