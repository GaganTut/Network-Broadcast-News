/*jshint esversion: 6*/
const net = require('net');

const clientArr = [];
const chatHistory = [];

const server = net.createServer((connection) => {
  clientArr.push(connection);
  connection.userName = 'Anonymous';
  connection.write('For Username, type $userName');

  connection.on('data', (data) => {
    if (data.toString().charAt(0) === '$') {
      clientArr.forEach((element) => {
        if (element === connection) {
          connection.userName = data.toString()
            .split("")
            .filter((element) => {return element !== '$';})
            .join("");
        }
      });
    } else {
      chatHistory.push(data.toString());
      clientArr.forEach((element) => {
        if (element !== connection) {
          element.write(`${connection.userName}: ${data.toString()}\n-----------------`);
        } else {
          element.write(`-----------------`);
        }
      });
    }
    console.log(`${connection.userName}: ${data.toString()}`);
  });

  connection.on('end', () => {
    console.log('Connection Ended');
  });
});

server.listen({port: 3000}, () => {
  console.log(`Connection is ON`);
});