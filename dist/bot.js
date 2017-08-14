'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeTelegramBotApi = require('node-telegram-bot-api');

var _nodeTelegramBotApi2 = _interopRequireDefault(_nodeTelegramBotApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TOKEN = process.env.TELEGRAM_TOKEN;
var url = process.env.APP_URL;

var options = {
  webHook: {
    port: process.env.PORT
  }
};
var bot = new _nodeTelegramBotApi2.default(TOKEN, options);

bot.setWebHook(url + '/bot' + TOKEN);

exports.default = bot;