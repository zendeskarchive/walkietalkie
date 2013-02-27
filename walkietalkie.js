function WalkieTalkie() {

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };

  this.uuid = uuid();
  this.storage = window.localStorage

  this.listeners = {
    message: {},
    property: {}
  };

  var self = this;
  window.addEventListener('storage', function(event) {
    if (/WalkieTalkie\.Message/.test(event.key)) {
      self.handleMessage(event);
    } else if (/WalkieTalkie\.Property\./.test(event.key)) {
      self.handlePropertyChange(event);
    }
  } , true);
}

WalkieTalkie.Message = function(name, data, publisher, receiver) {
  this.name = name
  this.data = data || {}
  this.publisher = publisher
  this.receiver = receiver
}

WalkieTalkie.Property = function(name, data, publisher) {
  this.name = name
  this.data = data
  this.publisher = publisher
}

WalkieTalkie.prototype.handleMessage = function(event) {
  if (event.newValue === null) return;
  var parsed = JSON.parse(event.newValue)
  var message = new WalkieTalkie.Message(parsed.name, parsed.data, parsed.publisher, parsed.receiver)
  if (message.receiver && message.receiver != self.uuid) return;
  this.invoke('message', message.name, message);
  this.storage.removeItem(event.key);
}

WalkieTalkie.prototype.handlePropertyChange = function(event) {
  var property = null;
  if (event.newValue === null) {
    var name = event.key.replace('WalkieTalkie.Property.', '')
    property = new WalkieTalkie.Property(name, null);
  } else {
    var parsed = JSON.parse(event.newValue)
    property = new WalkieTalkie.Property(parsed.name, parsed.data, parsed.publisher)
  }
  this.invoke('property', property.name, property);
}

WalkieTalkie.prototype.watch = function(name, callback) {
  this.listeners.property[name] = this.listeners[name] || [];
  this.listeners.property[name].push(callback);
};

WalkieTalkie.prototype.receive = function(name, callback) {
  this.listeners.message[name] = this.listeners[name] || [];
  this.listeners.message[name].push(callback);
};

WalkieTalkie.prototype.invoke = function(group, name, message) {
  var listeners = this.listeners[group][name] || [];
  for (key in listeners) {
    listeners[key](message);
  };
};

WalkieTalkie.prototype.publish = function(name, data) {
  var message = new WalkieTalkie.Message(name, data, this.uuid);
  this.storage.setItem('WalkieTalkie.Message', JSON.stringify(message))
  this.invoke('message', name, message);
};

WalkieTalkie.prototype.send = function(receiver, name, data) {
  var message = new WalkieTalkie.Message(name, data, this.uuid, receiver);
  this.storage.setItem('WalkieTalkie.Message', JSON.stringify(message))
  this.invoke('message', name, message);
};

WalkieTalkie.prototype.store = function(name, data) {
  var property = new WalkieTalkie.Property(name, data, this.uuid);
  this.storage.setItem('WalkieTalkie.Property.' + name, JSON.stringify(property))
  this.invoke('property', name, property);
};

WalkieTalkie.prototype.remove = function(name) {
  this.storage.removeItem('WalkieTalkie.Property.' + name)
  var property = new WalkieTalkie.Property(name, null, this.uuid);
  this.invoke('property', name, property);
};

WalkieTalkie.prototype.getProperty = function(name) {
  var retrieved = this.storage.getItem('WalkieTalkie.Property.' + name)
  if (retrieved) {
    var parsed = JSON.parse(retrieved);
    return new WalkieTalkie.Property(parsed.name, parsed.data, parsed.publisher)
  }
};

WalkieTalkie.prototype.get = function(name) {
  var property = null;
  if (property = this.getProperty(name)) {
    return property.data;
  } else {
    return null;
  }
};

