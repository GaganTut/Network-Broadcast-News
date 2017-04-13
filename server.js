/*jshint esversion: 6*/
const net = require('net');

const clientArr = [];
const chatHistory = [];
const specialKeys = `
  '?' : 'Help',\n
  '$' : 'Set Username',\n
  '/' : 'Secret Message to Server Only',\n
  '@' : 'Attach Username to Send Private'
`;

const server = net.createServer((connection) => {
  clientArr.push(connection);
  connection.userName = 'Anonymous';
  connection.write(`${specialKeys}\nENJOY CHATTING!`);

  connection.on('data', (data) => {
    switch (data.toString().charAt(0)) {
      case '@' :
        let privUser = data.toString().slice(1, data.toString().indexOf(' '));
        let message = data.toString().slice(data.toString().indexOf(' ')).slice(1);
        clientArr.forEach((element) => {
          if (element.userName === privUser) {
            element.write(`***${connection.userName} - PRIVATE - : ${data.toString()}`);
          }
        });
        break;
      case '?' :
        connection.write(`${specialKeys}`);
        break;
      case '$' :
        clientArr.forEach((element) => {
          if (element === connection) {
            connection.userName = data.toString().slice(1, -1);
          }
        });
        break;
      default:
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