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
    var exit = once(function() {
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
    add.emit('enter', div, exit)
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
