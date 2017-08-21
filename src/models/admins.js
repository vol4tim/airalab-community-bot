import db from './db'

const ref = db.ref('admins')
export default ref

export const update = (key, username, userId = null) => (
  db.ref('admins/' + key).set({
    username,
    userId
  })
)

export const add = (username) => {
  const key = ref.push().key;
  update(key, username);
  return key;
}

export const remove = (key) => (
  db.ref('admins/' + key).remove()
)

export const clear = () => {
  ref.remove()
}

export const byName = (username) => (
  ref.orderByChild("username").equalTo(username).once('value')
)

export const onAdd = (cb) => {
  db.ref('admins').on('child_added', (data) => {
    cb(data.key, data.val())
  })
}

export const onUpdate = (cb) => {
  db.ref('admins').on('child_changed', (data) => {
    cb(data.key, data.val())
  })
}

export const onRemove = (cb) => {
  db.ref('admins').on('child_removed', (data) => {
    cb(data.key)
  })
}
