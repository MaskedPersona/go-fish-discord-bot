const Discord = require('discord.js');

module.exports = {
  name: 'gulag',
  description: 'Puts a user in the gulag for a specified number of minutes',
  args: true,
  cooldown: 5,
  usage: '[user] [minutes] or "create"',
  execute(message, args) {
    // Checks if there are two arguments
    if(args.length !== 2) {
      // Checks if there is one argument and it is "create"
      if(args.length === 1 && args[0] === "create"){
        // Checks permissions of author
        if(message.guild.member(message.author).hasPermission("MANAGE_ROLES")) {
          // Checks if the gulag is already a role
          if(message.guild.roles.find(r => r.name === "Gulaged"))
            return message.channel.send("The gulag already exists comrade!");
          // Creates gulag role
          message.guild.createRole({
            name: "Gulaged",
            color: 5263440,
            hoist: true,
            position: 0,
            managed: false,
            mentionable: true,
            permissions: ['READ_MESSAGE_HISTORY', 'SPEAK']
          });
          return message.channel.send("The gulag has been created! Down with the communist pigs! :triumph:");
        } else
          return message.channel.send("You cannot create a gulag, capitalist swine! :rage:");
      }
      return message.channel.send(
          "This command takes 2 arguments you capitalist pig!");
    }

    // Checks if first argument is a user
    if(args[0] instanceof Discord.User)
      return message.channel.send("You can only gulag users, capitalist pig");

    // Checks if the second argument is a number
    if(isNaN(args[1]))
      return message.channel.send("You must specify the number of minutes to gulag a user, capitalist pig");

    const gulagedUser = message.mentions.members.first();
    // Checks for self-gulaging
    if(gulagedUser === message.author)
      return message.channel.send("You cannot gulag yourself comrade!");
    const gulagTime = parseInt(args[1]);

    // Checks if user is already gulaged
    if(gulagedUser.roles.find(r => r.name === "Gulaged")) {
      if (gulagTime === 0) {
        gulagedUser.removeRole(
            gulagedUser.roles.find(r => r.name === "Gulaged").id);
        return message.channel.send("The capitalist pig has been un-gulaged");
      }
      return message.channel.send("That user is already gulaged, comrade!");
    }

    // Checks if author has permission to gulag
    if (!message.guild.member(message.author).hasPermission('MANAGE_ROLES'))
      return message.channel.send("You don't have permission to gulag :triumph: capitalist pig");

    // Checks if user is an admin
    if(message.guild.member(gulagedUser.id).hasPermission('ADMINISTRATOR'))
      return message.channel.send("You cannot gulag your rulers, capitalist pig! :rage:");

    const role = message.guild.roles.find(r => r.name === "Gulaged");
    gulagedUser.addRole(role)
        .then(()=> message.channel.send(
            `${gulagedUser.toString()} has been gulaged for ${gulagTime} minutes :triumph:`))
        .catch(() =>{
          return message.channel.send("The gulag does not exist comrade! Use '\\gulag create' to make the gulag");
        });
  },
};