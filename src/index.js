import Promise from 'bluebird'
import _ from 'lodash'
import bot from './bot'
import * as chats from './models/chats'
import * as users from './models/users'
import * as admins from './models/admins'
import { Scene, addScene} from './scene'

let botUsername = '';
bot.getMe()
  .then((result) => {
    botUsername = result.username
  })

bot.onText(/\/start/, function (msg) {
  chats.add(msg.chat.id, '@' + msg.chat.username + ' ' + msg.chat.first_name + ' ' + msg.chat.last_name);
});

bot.on('message', msg => {
  if (_.has(msg, 'new_chat_member')) {
    if (msg.new_chat_member.username === botUsername) {
      chats.add(msg.chat.id, msg.chat.title);
    } else {
      users.add(msg.chat.id, msg.new_chat_member.id, msg.new_chat_member.username);
    }
  }
  if (_.has(msg, 'left_chat_member')) {
    users.remove(msg.chat.id, msg.left_chat_member.id);
  }
});

const access = (username) => {
  return admins.byName(username)
   .then((s) => {
     const value = s.val();
     if (value === null) {
       throw new Error('Доступ запрещен');
     }
     return true
   })
}

bot.onText(/\/admin (.+)/, function (msg, match) {
  const userId = msg.from.id;
  const username = match[1];
  access(msg.from.username)
    .then(() => admins.byName(username))
    .then((s) => {
      const value = s.val();
      if (value === null) {
        admins.add(username);
        bot.sendMessage(userId, 'Ок');
      } else {
        bot.sendMessage(userId, 'Уже добавлен');
      }
    })
    .catch((e) => {
      bot.sendMessage(userId, e.message);
    })
});

const steps = [
  (scene, msg) => {
    const userId = msg.from.id
    return access(msg.from.username)
      .then(() => chats.getChats())
      .then((list) => {
        const groups = []
        let i = 1
        list.forEach((item) => {
          const chat = item.val()
          groups.push(i + ') ' + chat.name)
          i += 1
        });
        let message = "Выберите группы в которые нужно отправить сообщение.\n"
        message += "Номера групп укажите через запятую\n"
        message += groups.join("\n")
        scene.bot.sendMessage(userId, message);
        return true
      })
      .catch((e) => {
        bot.sendMessage(userId, e.message);
        return Promise.reject(e)
      })
  },
  (scene, msg) => {
    const userId = msg.from.id
    const groupsNums = _.map(msg.text.split(','), (n) => {
      return _.toNumber(_.trim(n))
    });
    return chats.getChats()
      .then((list) => {
        const groups = []
        let i = 1
        list.forEach((item) => {
          if (_.includes(groupsNums, i)) {
            const chat = item.val()
            groups.push(chat.chatId)
          }
          i += 1
        });
        if (groups.length > 0) {
          scene.bot.sendMessage(userId, 'Напишите ваше сообщение');
          return groups
        }
        scene.bot.sendMessage(userId, 'Номера групп не выбранны(');
        return false;
      })
  },
  (scene, msg, history) => {
    const userId = msg.from.id
    _.forEach(history[1], (id) => {
      scene.bot.sendMessage(id, msg.text);
    })
    scene.bot.sendMessage(userId, 'Отправил');
    return;
  }
]
const scene = new Scene(bot, 'broadcast', steps)
addScene(scene);
