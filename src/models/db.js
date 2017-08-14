import * as firebase from 'firebase'

const KEY = process.env.FIREBASE_KEY;
const NAME = process.env.FIREBASE_NAME;

const config = {
  apiKey: KEY,
  authDomain: NAME + '.firebaseapp.com',
  databaseURL: 'https://' + NAME + '.firebaseio.com',
  storageBucket: NAME + '.appspot.com',
};
firebase.initializeApp(config);

const db = firebase.database();

export default db
