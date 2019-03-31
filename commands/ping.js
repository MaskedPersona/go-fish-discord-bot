module.exports = {
  name: 'ping',
  description: 'Ping!',
  execute(receivedMessage) {
    receivedMessage.channel.send('Pong.');
  },
};