/*jshint esversion: 6*/
const net = require('net');

const client = net.connect({port: 3000}, () => {
  console.log('Connected to Server!!!');

  client.on('data', (data) => {
    console.log(data.toString());
  });

  process.stdin.on('readable', () => {
    client.write(process.stdin.read());
  });

  client.on('end', () => {
    console.log('Connection Ended');
  });
});