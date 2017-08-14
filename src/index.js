import Promise from 'bluebird'
import _ from 'lodash'
import cron from 'node-cron'
import bot from './bot'
import * as chats from './models/chats'
import * as tasks from './models/tasks'

let botUsername = '';
bot.getMe()
  .then((result) => {
    botUsername = result.username
  })

bot.onText(/\/start/, function (msg) {
  chats.add(msg.chat.id, '@' + msg.chat.username + ' ' + msg.chat.first_name + ' ' + msg.chat.last_name);
});

bot.on('message', msg => {
  if (_.has(msg, 'new_chat_member') && msg.new_chat_member.username === botUsername) {
    chats.add(msg.chat.id, msg.chat.title);
  }
});

const send = (data) => {
  if (data.chatId === '') {
    return chats.getChats()
      .then((list) => {
        list.forEach((item) => {
          const chat = item.val()
          bot.sendMessage(chat.chatId, data.text);
        });
      })
  } else {
    bot.sendMessage(data.chatId, data.text);
  }
  return Promise.resolve();
}

let cronTasks = {}

tasks.onAdd((id, data) => {
  if (data.time === '') {
    send(data)
      .then(() => {
        tasks.remove(id);
      })
  } else {
    cronTasks[id] = cron.schedule(data.time, () => {
      send(data)
    });
  }
})

tasks.onRemove((id) => {
  if (_.has(cronTasks, id)) {
    cronTasks[id].destroy();
    cronTasks = _.omit(cronTasks, id);
  }
})
