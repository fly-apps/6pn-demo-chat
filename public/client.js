'use strict'
var socket = null;
var tm = null;

function ping() {
  socket.send('__ping__');
  tm = setTimeout(function () {
    // disconnected here
  }, 5000);
}

function pong() {
  clearTimeout(tm);
}

function startup() {
  connect();
}

function connect() {
  var serverUrl;
  var scheme = 'ws';
  var location = document.location;

  if (location.protocol === 'https:') {
    scheme += 's';
  }

  name=window.prompt("Enter a name for chat","rando");
  $('#n').val(name);
  $('#n').prop('disabled', true);
  $('#n').css('background', 'grey');
  $('#n').css('color', 'white');
  
  serverUrl = `${scheme}://${location.hostname}:${location.port}`;
  
  socket = new WebSocket(serverUrl, 'json');
  socket.onopen = () => {
    setInterval(ping,30000);
    sendNowon();
  }

  socket.onmessage = event => {
    if (event.data == "__ping__") {
      pong();
      return
    }
    const msg = JSON.parse(event.data)
    $('#messages').append($('<li>').text(msg.name + ':' + msg.message))
    window.scrollTo(0, document.body.scrollHeight);
  }

  socket.onclose = event => {
    alert(event);
  }

  $('form').submit(sendMessage);
}

function sendMessage() {
  name = $('#n').val();
  if (name == '') {
    return;
  }

  const msg = { type: 'message', name: name, message: $('#m').val() };
  socket.send(JSON.stringify(msg));
  $('#m').val('');
  return false;
}

function sendNowon() {
  const name = $('#n').val();
  const nowon={ type: "status", name:name, message:"is now online"}
  socket.send(JSON.stringify(nowon));
}
