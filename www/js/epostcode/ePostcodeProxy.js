
XMLHTTP = function() {

  var _options = {
   maxRequestLength: 1500,
   apiURL: 'https://ws.epostcode.com/remote.php',
   overrideMime: ''
  }

  this.status = null
  this.statusText = null
  this.responseText = null
  this.responseXML = null
  this.synchronous = false
  this.readyState = 0
  
  this.onreadystatechange =  function() { }
  this.onerror = function() { }
  this.onload = function() { }
  
  this.abort = function() {
    _stop = true
    _transport.abort()
  }

  this.setRequestHeader = function(name, value) {
    _request.headers[name] = value
  }
 
  this.getAllResponseHeaders = function() {
    var result = ''
    for (property in _responseHeaders)
      result += property + ': ' + _responseHeaders[property] + '\r\n'
    return result
  }
  
  this.getResponseHeader = function(name) {
    return _responseHeaders[property]
  }
  
  this.overrideMimeType = function(type) {
    _options.overrideMime = type
  }

  this.setAPI = function(url) {
	  _options.apiURL = url
  }
  
  this.open = function(method, url, sync, username, password) {
    _request.method = _is_defined(method)
    _request.url = _is_defined(url)
    var username = _is_defined(username)
    var password = _is_defined(password)
    var pos = _request.url.indexOf('://') + 3
    if((username || password) && pos > 2) {
      _request.url = _request.url.substr(0, pos)
        + username + ':'
        + password + '@'
        + _request.url.substr(pos)
    }
    _setReadyState(1)
  }
  
  this.openRequest = function(method, url, sync, username, password) {
    return this.open(method, url, sync, username, password)
  }
  
  this.send = function(data) {
    if (_stop) return
    _request.data = _is_defined(data)
    _transport.send(_request, _options)
  }
  
  var _is_defined = function(value) {
    return ('undefined' == typeof value) ? '' : value
  }

  var _throwError = function(description) {
    self.onerror(description)
    self.abort()
    return false
  }
  
  var _setReadyState = function(number) {
    self.readyState = number
    self.onreadystatechange()
    if(number == 4) self.onload()
  }

  var _parse = function(object) {
    if(_stop) return
    if(object.multipart) return
    if(!object.success)
      return _throwError(object.description)
    _responseHeaders = object.responseHeaders
    self.status = object.status
    self.statusText = object.statusText
    self.responseText = object.responseText
    self.responseXML = _xmlparser.parse(object.responseText)
    _setReadyState(4)
  }

  var self = this
  var _request = {
    headers: {
      "HTTP-Referer": document.location,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: 'GET',
    data: '',
    url: 'https://ws.epostcode.com/'
  }
  var _response = { }
  var _stop = false
  var _transport = new XMLHTTP.Transport(_parse)
  var _xmlparser = new XMLHTTP.XMLParser()
    
}

XMLHTTP.Transport = function(handler) {

  var _handler = function() { }

  var _registerCallback = function(handler) {
    _id = 'v' + Math.random().toString().substr(2)
    window[_id] = _onComplete
	_handler = handler
  }

  var _onComplete = function(data) {
	_destroyScripts()
	handler(data)
  }

  var _encode = function(params) {
    var headers = ''
    for (property in params.headers)
      headers += _encodeUTF(property +
	    ': ' + params.headers[property]) + '&'
    var data = params.method
      + '&' + _encodeUTF(params.url)
      + '&' + _encodeUTF(params.data)
      + '&' + headers
    return base64encode(data)
  }

  var _encodeUTF = function(string) {
	  return base64encode(utf8encode(string))
  }

  var _split = function(data, options) {
    var max = options.maxRequestLength - options.apiURL.length - 23
    var urls = [], total = Math.floor(data.length / max) + 1
    for (var part = 0; part < total; part++) {
      urls.push(options.apiURL +
        '?id=' + _id +
        '&part=' + part +
        '&total=' + total +
        '&data=' + data.substr(0, max))
      data = data.substr(max)
    }
    return urls
  }

  this.send = function(params, options) {
    var urls = _split(_encode(params), options)
    for(var i = 0; i < urls.length; i++) {
      var script = document.createElement('script')
      script.src = urls[i]
      script.type = 'text/javascript'
      script.charset = 'utf-8'
      script = document.getElementsByTagName('head')[0].appendChild(script)
      _scripts.push(script)
    }
  }

  var _destroyScripts = function() {
    for(var i = 0; i < _scripts.length; i++)
      if(_scripts[i].parentNode)
        _scripts[i].parentNode.removeChild(_scripts[i])
  }

  var self = this
  var _id, _scripts = []

  _registerCallback(handler)

}

var base64encode = function(input) {
  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
  do {
    chr1 = input.charCodeAt(i++)
    chr2 = input.charCodeAt(i++)
    chr3 = input.charCodeAt(i++)
    enc1 = chr1 >> 2
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    enc4 = chr3 & 63
    if (isNaN(chr2)) {
       enc3 = enc4 = 64
    } else if (isNaN(chr3)) {
       enc4 = 64
    }
    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
      keyStr.charAt(enc3) + keyStr.charAt(enc4)
  } while (i < input.length)
  return output
}


function utf8encode(input) {
  if ('string' != typeof input) return ''
  input = input.replace(/\r\n/g,"\n");
  var output = "";
  for(var n = 0; n < input.length; n++) {
    var c = input.charCodeAt(n)
    if('null' != typeof c) {
      if (c < 128) {
        output += String.fromCharCode(c); }
      else if((c > 127) && (c < 2048)) {
        output += String.fromCharCode((c >> 6) | 192);
        output += String.fromCharCode((c & 63) | 128); }
      else {
        output += String.fromCharCode((c >> 12) | 224);
        output += String.fromCharCode(((c >> 6) & 63) | 128);
        output += String.fromCharCode((c & 63) | 128);}
    }
  }
  return output;
}

XMLHTTP.XMLParser = function() {

  this.parse = function(text) { }

}




