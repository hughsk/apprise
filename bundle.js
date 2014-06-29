(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var notify = require('./')({
    bottom: true
  , right: true
})

var cols = [ '#FF6F5C', '#FFE169', '#66C4FF', '#61FF90', '#A9B0C2' ]

notify.on('enter', function(node) {
  node.classList.add('notification')
  node.style.background = cols[
    Math.floor(Math.random() * cols.length)
  ]

  node.style.opacity = 0
  setTimeout(function() {
    node.style.opacity = 1
  }, 1)
}).on('exit', function(node) {
  node.style.opacity = 0
  node.style.right = '-400px'
  setTimeout(function() {
    node.parentNode.removeChild(node)
  }, 1000)
})

setInterval(update, 8000)
update()
function update() {
  for (var i = 0; i < 10; i++) (function(i) {
    setTimeout(function() {
      var node = notify(2000 + Math.random() * 2500)

      node.innerHTML = 'notification #' + i
    }, i * 500)
  })(i)
}

},{"./":2}],2:[function(require,module,exports){
var emitter = require('emitter-component')
var once    = require('once')

module.exports = apprise

function apprise(options) {
  var notifications = []
  var wrapper = document.body.appendChild(
    document.createElement('div')
  )

  options = options || {}

  var top  = !!options.top
  var left = !!options.left
  if (options.right) left = false
  if (options.bottom) top = false
  if (options.right === false) left = true
  if (options.bottom === false) top = true

  wrapper.style.position = 'fixed'
  wrapper.style[left ? 'left' : 'right'] = '0px'
  wrapper.style[top  ? 'top' : 'bottom'] = '0px'

  return add = emitter(add)

  function add(timeout) {
    var div = document.createElement('div')
    var exit = div.closeNotification = once(function() {
      var idx = notifications.indexOf(div)
      if (idx !== -1) notifications.splice(idx, 1)

      add.emit('exit', div)
      update()
    })

    if (timeout) {
      setTimeout(exit, timeout || 1000)
    }

    div.style.position = 'absolute'
    div.style[left ? 'left' : 'right'] = '0px'

    notifications.push(div)
    add.emit('enter', div)
    wrapper.appendChild(div)
    update()

    return div
  }

  function update() {
    var key    = top ? 'top' : 'bottom'
    var offset = top ? 1 : -1
    var y      = 0

    for (var i = 0; i < notifications.length; i++) {
      var notification = notifications[i]
      var bounds = notification.getBoundingClientRect()
      var style  = getComputedStyle(notification)

      var mtop = parseFloat(style.getPropertyValue('margin-top'))
      var mbot = parseFloat(style.getPropertyValue('margin-bottom'))

      notification.style[key] = y + 'px'
      y += bounds.height
      y += mbot
      y += mtop
    }
  }
}

},{"emitter-component":3,"once":4}],3:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],4:[function(require,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

},{}]},{},[1])