const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

// Creates a collection of cooldowns
const cooldowns = new Discord.Collection();



// Connect to Discord and set game status
client.on('ready', () => {
  console.log("Connected as " + client.user.tag);
});

// Event listener for messages
client.on('message', message => {
  // Prevent bot from responding to its own messages
  if (message.author.bot) return;

  // Checks for swe words
  if(swearCheck(message)) return;

  // Checks if "anime" appears in the message
  checkForAnime(message);

  // Checks for prefix
  if (!message.content.startsWith(config.prefix))
    return;


  let args = message.content.slice(config.prefix.length).split(/ +/);
  let commandName = args.shift().toLowerCase();

  // Checks if command exists
  if (!client.commands.has(commandName)) return;

  let command = client.commands.get(commandName);

  // Checks if command is guild only
  if (command.guildOnly && message.channel.type !== 'text')
    return message.reply('I can\'t execute that command inside DMs!');

  // Checks if command needs arguments and message contains them
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage)
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    return message.channel.send(reply);
  }


  // Adds cooldown from command to collection of cooldowns
  if (!cooldowns.has(command.name))
    cooldowns.set(command.name, new Discord.Collection());
  // Gets the current time
  let now = Date.now();
  // Sets timestamps to
  let timestamps = cooldowns.get(command.name);
  let cooldownAmount = (command.cooldown) * 1000;

  if (timestamps.has(message.author.id)) {
    let expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      let timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)}` +
          ` more second(s) before reusing the \`${command.name}\` command.`);
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


  // Actually executes command
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

// Checks for and deletes messages with swear words in them, returns true if found
function swearCheck(message) {
  let swearsList = [
    "anal",
    "anus",
    "arse",
    "ass",
    "bastard",
    "bitch",
    "blowjob",
    "boner",
    "boob",
    "cock",
    "coon",
    "cunt",
    "damn",
    "dick",
    "dildo",
    "dyke",
    "fag",
    "fellatio",
    "fuck",
    "goddamn",
    "god damn",
    "hell",
    "homo",
    "cum",
    "nigger",
    "nigga",
    "penis",
    "piss",
    "prick",
    "pussy",
    "queer",
    "scrotum",
    "sex",
    "shit",
    "slut",
    "tit",
    "twat",
    "vagina",
    "whore"
  ];

  for (let swear of swearsList)
    if (message.toString().includes(swear)){
      if (Math.floor(Math.random() * 2) === 1)
        message.channel.send("NO SWEARING!! " + message.author.toString() + " 😡");
      else
        message.channel.send("NO SWEARING!! " + message.author.toString() + " 😠💢");
      message.delete().then(() => console.log("User message deleted for swearing"));
      return true;
    }
}

// Checks and responds to the user if "anime" is found in the message
function checkForAnime(message)  {
  // Exit if message or username doesn't contain the word anime
  if (!(message.toString().toLowerCase().includes("anime") &&
      message.author.name.toLowerCase().includes("anime")))
    return;

  let reactEmoji = message.guild.emojis.find('name', 'NoAnimePenguin');
  message.react(reactEmoji.id)
    .then(() => {
      console.log("Reacted to anime");
      message.channel.send("NO\t" + reactEmoji.toString() +
          "\nANIME\t" + reactEmoji.toString() +
          "\n!!!\t" + reactEmoji.toString());
    });
}



client.login(config.token).then(() => client.user.setActivity("Competitive Go Fish"));