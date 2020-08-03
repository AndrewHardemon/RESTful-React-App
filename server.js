//Server file
const http = require('http');
// import { App as app } from './app'
const app = require('./app'); //issue in typescript
const port = process.env.PORT || 3000;
const server = http.createServer(app); //add a listener

server.listen(port);

