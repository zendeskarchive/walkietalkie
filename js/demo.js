function parseQuery() {
  var parts = window.location.search.split('?').pop().split('&');
  var query = {};
  for (n in parts) {
    var split = parts[n].split('=');
    query[split[0]] = split[1];
  }
  return query;
}

function debug(msg) {
  var el = document.getElementById('debug');
  el.innerHTML += msg + "<br>"
}


function getCursorPosition(e) {
  var element = $('canvas');
  var offset = element.offset();
  var x;
  var y;
  if (e.pageX != undefined && e.pageY != undefined) {
    x = e.pageX;
    y = e.pageY;
  }
  x -= offset.left;
  y -= offset.top;
  return { x: x, y: y }
}


