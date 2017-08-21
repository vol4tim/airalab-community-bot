'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = exports.addScene = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scene = function () {
  function Scene(bot, command, steps) {
    _classCallCheck(this, Scene);

    this.bot = bot;
    this.command = command;
    this.history = {};
    if (_lodash2.default.isArray(steps)) {
      this.stepsName = [];
      for (var i = 0; i < steps.length; i++) {
        this.stepsName.push(i);
      }
      this.steps = steps;
    } else {
      this.stepsName = _lodash2.default.keys(steps);
      this.steps = _lodash2.default.values(steps);
    }
  }

  _createClass(Scene, [{
    key: 'run',
    value: function run(msg) {
      var userId = msg.from.id;
      this.history[userId] = {};
      this.step(msg);
    }
  }, {
    key: 'step',
    value: function step(msg) {
      var _this = this;

      var userId = msg.from.id;
      if (_lodash2.default.has(this.history, userId)) {
        var currentStep = _lodash2.default.keys(this.history[userId]).length;
        var result = this.steps[currentStep](this, msg, this.history[userId]);
        if (_lodash2.default.isObject(result) && _lodash2.default.isFunction(result.then)) {
          result.then(function (r) {
            if (r === false) {
              _this.stop(userId, currentStep, true);
            } else {
              _this.history[userId][_this.stepsName[currentStep]] = r;
              _this.stop(userId, currentStep);
            }
          }).catch(function () {
            _this.stop(userId, currentStep, true);
          });
        } else if (result === false) {
          this.stop(userId, currentStep, true);
        } else {
          this.history[userId][this.stepsName[currentStep]] = result;
          this.stop(userId, currentStep);
        }
      }
    }
  }, {
    key: 'stop',
    value: function stop(userId, currentStep) {
      var isForce = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (isForce || !_lodash2.default.has(this.steps, currentStep + 1)) {
        this.history = _lodash2.default.omit(this.history, userId);
      }
    }
  }]);

  return Scene;
}();

var addScene = function addScene(scene) {
  var command = new RegExp('/' + scene.command);
  scene.bot.onText(command, function (msg) {
    scene.run(msg);
  });
  scene.bot.on('text', function (msg) {
    scene.step(msg);
  });
};

exports.addScene = addScene;
exports.Scene = Scene;