module.exports = {
  name: 'pruneMessages',
  description: 'Deletes X[2,100] number of messages',
  aliases: ['clear','delete'],
  args: true,
  useage: '[messages]',
  execute(message, args) {
    if (isNaN(args[0]))
      return message.channel.send("Please input a number");

    if (args[0]<2 || args[0]>100)
      return message.channel.send("Number must be between 2 and 100");

    return message.channel.bulkDelete(x, true)
        .then(() => {
          // Alert user that messages have been deleted then delete alert after 2 sec.
          message.channel.send("Messages deleted! :smile:")
              .then(msg => msg.delete(3000));
        })
        .catch(() => {
          console.log("Attempted to delete messages older than 2 weeks");
        });
  },
};