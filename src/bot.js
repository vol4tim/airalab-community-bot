import TelegramBot from 'node-telegram-bot-api'

const TOKEN = process.env.TELEGRAM_TOKEN;
const url = process.env.APP_URL;

const options = {
  webHook: {
    port: process.env.PORT
  }
};
const bot = new TelegramBot(TOKEN, options);

bot.setWebHook(`${url}/bot${TOKEN}`);

export default bot
