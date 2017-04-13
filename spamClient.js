/*jshint esversion: 6*/
const net = require('net');

const client = net.connect({port: 3000}, () => {

  process.stdin.on('readable', () => {
    let chunk = process.stdin.read();
    if (chunk.indexOf('/flood') === 0) {
      while (0 < 1) {
        client.write(chunk.slice(5, -1));
      }
    } else {
      client.write(chunk);
    }
  });
});