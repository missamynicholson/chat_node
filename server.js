var http = require("http"), fs = require("fs"), url = require("url");

var messages = [];
var clients = [];

http.createServer(function(req, res) {
  // parse URL
  var url_parts = url.parse(req.url);

  if(url_parts.pathname == '/') {
    readFile(res);
  } else if(url_parts.pathname.substr(0, 5) == '/poll') {
    polling(res, url_parts);
  } else if(url_parts.pathname.substr(0, 5) == '/msg/') {
    receiveMessage(res, url_parts);
  }
}).listen(8080);
console.log('Server running.');


function readFile(res) {
  //same-origin polcy, so this allows us to send back index.html on same server as server.js
  fs.readFile('./index.html', function(err, data) {
    res.end(data);
  });
}

function polling(res, url_parts) {
   var count = url_parts.pathname.replace(/[^0-9]*/, ''); ///poll/123 => "123"

   if(messages.length > count) {
     newMessage(res);
   } else {
     clients.push(res); //no new messages, store the response in the client array, request remains open
   }
}

function newMessage(res) {
  res.end(JSON.stringify( {
    count: messages.length,
    append: messages.slice(count).join('\n')+'\n' //all messages sliced up, joined by newline
  }));
}

function receiveMessage(res, url_parts) {
  var msg = unescape(url_parts.pathname.substr(5));
  messages.push(msg);
  notifyClients(msg); //notify all pending clients and end their pending request
  res.end();
}

function notifyClients(msg) {
  while(clients.length > 0) {
    var client = clients.pop();
    client.end(JSON.stringify( {
      count: messages.length,
      append: msg+'\n'
    }));
  }
}
