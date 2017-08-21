import db from './db'

const ref = db.ref('users')
export default ref

export const update = (chatId, userId, username) => (
  db.ref('users/' + chatId +'/' + userId).set(username)
)

export const add = (chatId, userId, username) => {
  update(chatId, userId, username);
}

export const remove = (chatId, userId) => (
  db.ref('users/' + chatId +'/' + userId).remove()
)

export const clear = () => {
  ref.remove()
}

export const onAdd = (chatId, cb) => {
  db.ref('users/' + chatId).on('child_added', (data) => {
    cb(data.key, data.val())
  })
}

export const onUpdate = (chatId, cb) => {
  db.ref('users/' + chatId).on('child_changed', (data) => {
    cb(data.key, data.val())
  })
}

export const onRemove = (chatId, cb) => {
  db.ref('users/' + chatId).on('child_removed', (data) => {
    cb(data.key)
  })
}
