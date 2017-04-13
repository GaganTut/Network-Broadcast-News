/*jshint esversion: 6*/
const net = require('net');

const clientArr = [];
const chatHistory = [];

const server = net.createServer((connection) => {
  clientArr.push(connection);

  connection.on('data', (data) => {
    chatHistory.push(data.toString());
    console.log(`${data.toString()}`);
    for (let i = 0; i < clientArr.length; i++) {
      if (connection !== clientArr[i]) {
        clientArr[i].write(data);
      }
    }
  });

  connection.on('end', () => {
    console.log('Connection Ended');
  });
});

server.listen({port: 3000}, () => {
  console.log(`Connection is ON`);
});