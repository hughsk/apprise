# apprise [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A simple browser module for displaying stacking notifications.

This module makes as few assumptions about styling as possible, and simply
handles stacking notifications fixed to the screen – you'll even have to remove
the elements yourself when they're done. None the less, this should simplify the
implementation for you while still providing you plenty of design flexibility.

[![apprise](http://imgur.com/GSKCt0u.png)](http://hughsk.io/apprise)

## Usage

[![NPM](https://nodei.co/npm/apprise.png)](https://nodei.co/npm/apprise/)

### notify = apprise(options)

Returns a `notify` function that you can use to create new notifications.

Accepts the following options:

* `top`: boolean – set to true to align the notifications with the top of the screen.
* `left`: boolean – set to true to align the notifications with the left of the screen.
* `bottom`: convenience option – opposite of `top`.
* `right`: convenience option – opposite of `left`.

### div = notify([timeout])

Create a new notification. You're handed back a DOM element which will be
attached to a `fixed` element shared with the other notifications.

Optionally, you can pass a `timeout` value in milliseconds to automatically
remove the notification.

### notify.on('enter', enter(node, close))

Triggered when a new notification is created. Use this for adding common
content/functionality to notifications.

The `node` passed to the event is that notification's `<div>` element.

`close` is a function which will trigger the `exit` event on the notification,
in case you opted not to use a timeout or would like to remove it early.

### notify.on('exit', exit(node))

Triggered when a notification is removed. Use this to remove notifications
from the DOM. The `node` passed to the event is that notification's `<div>`
element.

## License

MIT. See [LICENSE.md](http://github.com/hughsk/apprise/blob/master/LICENSE.md) for details.
