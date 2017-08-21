'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bot = require('./bot');

var _bot2 = _interopRequireDefault(_bot);

var _chats = require('./models/chats');

var chats = _interopRequireWildcard(_chats);

var _users = require('./models/users');

var users = _interopRequireWildcard(_users);

var _admins = require('./models/admins');

var admins = _interopRequireWildcard(_admins);

var _scene = require('./scene');

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
  if (_lodash2.default.has(msg, 'new_chat_member')) {
    if (msg.new_chat_member.username === botUsername) {
      chats.add(msg.chat.id, msg.chat.title);
    } else {
      users.add(msg.chat.id, msg.new_chat_member.id, msg.new_chat_member.username);
    }
  }
  if (_lodash2.default.has(msg, 'left_chat_member')) {
    users.remove(msg.chat.id, msg.left_chat_member.id);
  }
});

var access = function access(username) {
  return admins.byName(username).then(function (s) {
    var value = s.val();
    if (value === null) {
      throw new Error('Доступ запрещен');
    }
    return true;
  });
};

_bot2.default.onText(/\/admin (.+)/, function (msg, match) {
  var userId = msg.from.id;
  var username = match[1];
  access(msg.from.username).then(function () {
    return admins.byName(username);
  }).then(function (s) {
    var value = s.val();
    if (value === null) {
      admins.add(username);
      _bot2.default.sendMessage(userId, 'Ок');
    } else {
      _bot2.default.sendMessage(userId, 'Уже добавлен');
    }
  }).catch(function (e) {
    _bot2.default.sendMessage(userId, e.message);
  });
});

var steps = [function (scene, msg) {
  var userId = msg.from.id;
  return access(msg.from.username).then(function () {
    return chats.getChats();
  }).then(function (list) {
    var groups = [];
    var i = 1;
    list.forEach(function (item) {
      var chat = item.val();
      groups.push(i + ') ' + chat.name);
      i += 1;
    });
    var message = "Выберите группы в которые нужно отправить сообщение.\n";
    message += "Номера групп укажите через запятую\n";
    message += groups.join("\n");
    scene.bot.sendMessage(userId, message);
    return true;
  }).catch(function (e) {
    _bot2.default.sendMessage(userId, e.message);
    return _bluebird2.default.reject(e);
  });
}, function (scene, msg) {
  var userId = msg.from.id;
  var groupsNums = _lodash2.default.map(msg.text.split(','), function (n) {
    return _lodash2.default.toNumber(_lodash2.default.trim(n));
  });
  return chats.getChats().then(function (list) {
    var groups = [];
    var i = 1;
    list.forEach(function (item) {
      if (_lodash2.default.includes(groupsNums, i)) {
        var chat = item.val();
        groups.push(chat.chatId);
      }
      i += 1;
    });
    if (groups.length > 0) {
      scene.bot.sendMessage(userId, 'Напишите ваше сообщение');
      return groups;
    }
    scene.bot.sendMessage(userId, 'Номера групп не выбранны(');
    return false;
  });
}, function (scene, msg, history) {
  var userId = msg.from.id;
  _lodash2.default.forEach(history[1], function (id) {
    scene.bot.sendMessage(id, msg.text);
  });
  scene.bot.sendMessage(userId, 'Отправил');
  return;
}];
var scene = new _scene.Scene(_bot2.default, 'broadcast', steps);
(0, _scene.addScene)(scene);