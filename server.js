var http = require("http"), fs = require("fs"), url = require("url");

var messages = ['test message'];
var clients = [];

http.createServer(function(request, response) {
  fs.readFile('./index.html', function(err, data) {
    response.end(data);
  });
}).listen(8080);
console.log('Server running.');

//same-origin polcy, so this allows us to send back index.html on same server as server.js
