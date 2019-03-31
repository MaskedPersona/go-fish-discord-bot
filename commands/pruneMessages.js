module.exports = {
  name: 'pruneMessages',
  description: 'Deletes X[2,100] number of messages',
  execute(x, receivedMessage) {
    x = parseInt(x);
    if (isNaN(x))
      return receivedMessage.channel.send("Please input a number");
    if (x<2 || x>100)
      return receivedMessage.channel.send("Number must be between 2 and 100");
    return receivedMessage.channel.bulkDelete(x, true)
    .then(() => {
      // Alert user that messages have been deleted then delete alert after 2 sec.
      receivedMessage.channel.send("Messages deleted! :smile:")
      .then(msg => msg.delete(3000));
    })
    .catch(() => {
      console.log("Attempted to delete messages older than 2 weeks");
    });
  },
};