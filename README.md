walkietalkie
============

sharing properties and simple pub-sub for tabs and windows written on top of localStorage

Usage
=====

```js
// Initialize a talkie
var talkie = new WalkieTalkie();
```

properties
==========

```js
// Store a value in a property
talkie.store('foo', bar);
```

```js
// Get the value of a property
talkie.get('foo');
```

```js
// Remove a property
talkie.remove('foo');
```

```js
// Watch a property
talkie.watch("foo", function(property) {
  console.log(property);
});
```

messages
==========

```js
// Publish a message
talkie.publish('foo', bar);
```

```js
// Send a message
var destination = 'my-fancy-uuid';
talkie.send(destination, 'foo', bar);

// Fetching your uuid
talkie.uuid
```

```js
// Receive messages
talkie.receive("foo", function(message) {
  console.log(message);
})
```

