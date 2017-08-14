'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _firebase = require('firebase');

var firebase = _interopRequireWildcard(_firebase);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var KEY = process.env.FIREBASE_KEY;
var NAME = process.env.FIREBASE_NAME;

var config = {
  apiKey: KEY,
  authDomain: NAME + '.firebaseapp.com',
  databaseURL: 'https://' + NAME + '.firebaseio.com',
  storageBucket: NAME + '.appspot.com'
};
firebase.initializeApp(config);

var db = firebase.database();

exports.default = db;