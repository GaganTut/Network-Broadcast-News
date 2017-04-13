/*jshint esversion: 6*/
const net = require('net');

const client2 = net.connect({port: 3000}, () => {
  console.log('Connected to Server!!!');

  client2.on('data', (data) => {
    console.log(data.toString());
  });

  process.stdin.on('readable', () => {
    client2.write(process.stdin.read());
  });

  client2.on('end', () => {
    console.log('Connection Ended');
  });
});