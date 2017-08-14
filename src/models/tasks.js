import db from './db'

const ref = db.ref('tasks')
export default ref

export const update = (key, chatId, time, text) => (
  db.ref('tasks/' + key).set({
    chatId,
    time,
    text
  })
)

export const add = (chatId, time, text) => {
  const key = ref.push().key;
  update(key, chatId, time, text);
  return key;
}

export const remove = key => (
  db.ref('tasks/' + key).remove()
)

export const clear = () => {
  ref.remove()
}

export const getTasks = () => (
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
