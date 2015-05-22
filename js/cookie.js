var set_cookie = function(name, value, timeout) {
  var dt = new Date();
  dt.setTime(dt.getTime() + (timeout * 1000));
  var expires = 'expires=' + dt.toUTCString();
  document.cookie = name + '=' + value + '; ' + expires;
};

var get_cookie = function(name) {
  var identifier = name + '=';
  var items = document.cookie.split(';');

  for (var i=0; i < items.length; i++) {
    var ck = items[i];
    while (ck.charAt(0) == ' ') ck = ck.substring(1);
    if (ck.indexOf(identifier) == 0) return ck.substring(identifier.length, ck.length);
  }

  return undefined;
};
