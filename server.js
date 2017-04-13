/*jshint esversion: 6*/
const net = require('net');
//Data Arrays
const clientArr = [];
const fullChatLog = [];
const nameChangeLog = [];
const privMessageLog = [];
const serverMessageLog = [];
//User Tools Key
const specialKeys = `
  ? : Help
  $ : Set Username:  '$sample'
  / : Private Message to Admin : '/msg'
  @ : Private Message: '@User Msg'
  ~ : See User List
`;
//Admin Tools Key
const adminTools = `
  ? : Help
  ! : Kick User: '!sampleUser'
  @ : Private Message: '@User Msg'
  ~ : See User List
  * : Read Private Message Log
  $ : Read Namechange Log
  % : Read Chat Log
  - : Read Direct Server Message Log
`;
//Custom Message Divider
const divider = '-----------------';

const server = net.createServer((connection) => {
  //Server Admin
  server.userName = '[ADMIN]';
  //When socket first connects, give anonymous userName/send user Tools
  clientArr.push(connection);
  connection.userName = `Anonymous${clientArr.length}`;
  connection.write(`${specialKeys}\nENJOY CHATTING!\n${divider}`);
  //Event Listener for when data comes in. Checks for character for special tools
  connection.on('data', (data) => {
    switch (data.toString().charAt(0)) {
      case '?' : //Help - Send User Tools
        connection.write(`${specialKeys}`);
        break;

      case '$' : //User request to change name
        if (clientArr.some((element) => element.userName === data.toString().slice(1, -1) || data.toString().slice(1, -1).toLowerCase().indexOf('admin') > -1)) {
          connection.write('Username Invalid or In Use!');
        } else {
          clientArr.forEach((element) => {
            if (element === connection) {
              nameChangeLog.push(`${connection.userName}: ${data.toString()}`);
              connection.userName = data.toString().slice(1, -1);
            }
          });
        }
        break;

      case '/' : //User sends private message to admin
        console.log(`(${connection.userName}) (${data.toString().slice(1, -1)})`);
        serverMessageLog.push(`${connection.userName}: ${data.toString()}`);
        break;

      case '@' : //Private Message
        let privUser = data.toString().slice(1, data.toString().indexOf(' '));
        let message = data.toString().slice(data.toString().indexOf(' ')).slice(1);
        clientArr.forEach((element) => {
          if (element.userName === privUser) {
            element.write(`***${connection.userName}: ${message}`);
          }
        });
        privMessageLog.push(`${connection.userName}: ${data.toString()}`);
        break;

      case '~' : //Request to see user list
        connection.write(`${clientArr.map((element) => element.userName).join(', ')}`);
        break;

      default: //Default user sends message to group
        clientArr.forEach((element) => {
          if (element !== connection) {
            element.write(`${connection.userName}: ${data.toString().slice(0, -1)}\n${divider}`);
            fullChatLog.push(`${connection.userName}: ${data.toString()}`);
          } else {
            element.write(`${divider}`);
          }
        });
    }
  });
});

server.listen({port: 3000}, () => {
  console.log(`Connection is ON\n${adminTools}`);
});


//Server Admin chats and admin tools
process.stdin.on('data', (data) => {
  switch (data.toString().charAt(0)) {

    case '?' : //Display admin tools
      console.log(adminTools);
      break;

    case '!' : //Kick User
      clientArr.filter((element) => {
        return element.userName === data.toString().slice(1, -1);
      }).forEach((element) => {
        clientArr.splice(clientArr.indexOf(element, 1));
        element.end(`${server.userName}: You Have Been Kicked`);
      });
      break;

    case '@' : //Send private Message to user
      let privUser = data.toString().slice(1, data.toString().indexOf(' '));
      let message = data.toString().slice(data.toString().indexOf(' ')).slice(1);
      clientArr.forEach((element) => {
        if (element.userName === privUser) {
          element.write(`***${server.userName} - PRIVATE - : ${message}`);
        }
      });
      break;

    case '~' : //Request to see user list
      console.log(`${clientArr.map((element) => element.userName).join(', ')}`);
      break;

    case '*' :
      console.log(privMessageLog.join(''));
      break;

    case '$' :
      console.log(nameChangeLog.join(''));
      break;

    case '%' :
      console.log(fullChatLog.join(''));
      break;

    case '-' :
      console.log(serverMessageLog.join(''));
      break;

    default : //Broadcast Message to all
      clientArr.forEach((element) => {
      element.write(`${server.userName} : ${data}`);
    });
  }
});