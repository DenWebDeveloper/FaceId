const http = require('http');
const face = require('face');

http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
}).listen(8000);