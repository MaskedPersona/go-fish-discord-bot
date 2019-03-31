const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

// Connect to Discord and set game status
client.on('ready', () => {
  console.log("Connected as " + client.user.tag);
});
client.login(config.token).then(() => client.user.setActivity("Competitive Go Fish"));

// Event listener for messages
client.on('message', receivedMessage => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author.bot || receivedMessage.channel.type === "dm") return;

  // Checks for swe words
  if(swearCheck(receivedMessage)) return;

  // Checks if "anime" appears in the message
  checkForAnime(receivedMessage);

  // Checks for commands
  if (receivedMessage.content.startsWith(config.prefix)){
    let fullCommand = receivedMessage.content.substr(1); // Received message minus the prefix
    let args = fullCommand.split(/ +/); // All other words are arguments/parameters/options for the command
    let primaryCommand = args.shift().toLowerCase(); // First word directly after command

    if (primaryCommand === "help") {
      sendHelpMessage(receivedMessage.author)
    }
    else if (primaryCommand === "ping")
      ;
    else if (primaryCommand === "prune" && args.length>0)
      ;
    else
      return receivedMessage.channel.send("You really think so? " +
        receivedMessage.author.toString());
  }
});

// Checks for and deletes messages with swear words in them, returns true if found
function swearCheck(receivedMessage) {
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
    if (receivedMessage.toString().includes(swear)){
      if (Math.floor(Math.random() * 2) === 1)
        receivedMessage.channel.send("NO SWEARING!! " + receivedMessage.author.toString() + " 😡");
      else
        receivedMessage.channel.send("NO SWEARING!! " + receivedMessage.author.toString() + " 😠💢");
      receivedMessage.delete().then(() => console.log("User message deleted for swearing"));
      return true;
    }
}

// Checks and responds to the user if "anime" is found in the message
function checkForAnime(receivedMessage)  {
  // If it doesn't find the word anime in the message, just return nothing
  if (!receivedMessage.toString().toLowerCase().includes("anime"))
    return;

  let reactEmoji = receivedMessage.guild.emojis.find('name', 'NoAnimePenguin')
    .catch(() => console.error("NoAnimePenguin emoji not found"));
  receivedMessage.react(reactEmoji.id)
    .then(() => {
      console.log("Reacted to anime");
      receivedMessage.channel.send("NO\t" + reactEmoji.toString() +
          "\nANIME\t" + reactEmoji.toString() +
          "\n!!!\t" + reactEmoji.toString());
    });
}

// DMs the user the help message
function sendHelpMessage(author) {
  author.send(
    "***List of helpful commands :smile:***"+"\n\n"+
    "**prune X**"+"\n"+
      "\tRemoves X number of messages from the chat (must be before 2 weeks)"+"\n"+
    "**And many more hidden commands :wink:**"
  );
}
