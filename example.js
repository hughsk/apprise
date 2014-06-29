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
