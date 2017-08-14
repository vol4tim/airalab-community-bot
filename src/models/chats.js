import db from './db'

const ref = db.ref('chats')
export default ref

export const update = (key, chatId, name) => (
  db.ref('chats/' + key).set({
    chatId,
    name
  })
)

export const add = (chatId, name) => {
  const key = chatId;
  update(key, chatId, name);
  return key;
}

export const remove = key => (
  db.ref('chats/' + key).remove()
)

export const clear = () => {
  ref.remove()
}

export const getChats = () => (
  ref.once('value')
)

export const onAdd = (cb) => {
  ref.on('child_added', (data) => {
    cb(data.key, data.val())
  })
}

export const onUpdate = (cb) => {
  ref.on('child_changed', (data) => {
    cb(data.key, data.val())
  })
}

export const onRemove = (cb) => {
  ref.on('child_removed', (data) => {
    cb(data.key)
  })
}
