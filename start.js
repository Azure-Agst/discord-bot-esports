const Discord = require('discord.js');
const request = require('request');
const client = new Discord.Client();
var bot = require("./bot.json");
var twitchapi = bot.api;
var error = 0;

client.on('ready', () => {
  var date = new Date();
  client.user.setGame(null);
  client.user.setPresence({game: {name: "with my code", type: 0}});
  client.channels.find("name", "development").send(bot.name+" v"+bot.version+" has started! Started:\n" + date);
  console.log('logged in as:');
  console.log("user: "+client.user.tag);
  console.log("id: "+client.user.id);
  console.log("----------");

});

client.on('message', message => {
  if (message.content.startsWith(bot.prefix)) {

    if(message.author.bot) return; //bot fights are normally cool, but not in this case. :/

    //Congrats! You issued a command! Preparing for processing!
    var date = new Date(); //Let's grab a timestamp...
    var issuer = message.author.username; //... your username...
    var issuer_mention = message.author.toString(); // ... your mention...
    var prefixless = message.toString().substr(1); //... and then remove the prefix from the command.
    var command = prefixless.split(" ");
    console.log(date); //Then, we log the timestamp...
    console.log(issuer+" issued command: \n\""+prefixless+"\""); //... Log the command issued in string form...
    console.log(command); //... And lastly, print the array for debugging.

    if(bot.streamlabs.includes(command[0]))return; //no streamlabs/nightbot interference

    //Here we go!
    switch (command[0]) {
      case "ping":
        message.reply("pong!");
        break;

      case "pong":
        message.reply("ping!");
        break;

      case "ban":
        if (message.member.permissions.has("BAN_MEMBERS")) {
          if(command[1]==null){message.reply("Not enough parameters!");break;}
          var user = message.mentions.members.first();
          message.guild.ban(user,1).catch(error => message.reply(`Couldn't ban user because of: ${error}`));
          message.reply('Banned user ID: '+user+"!");
        } else {
          message.reply("Insuficcient perms, man. Nice try.");
          console.log("Attempted by ID: "+message.author.tag);
        }
        break;

      case "kick":
        if (message.member.permissions.has("KICK_MEMBERS")) {
          if(command[1]==null){message.reply("Not enough parameters!");break;}
          var user = message.mentions.members.first();
          user.kick(command.slice(1)).catch(error => message.reply(`Couldn't kick user because of: ${error}`));
          message.reply('Kicked user ID: '+user+"!");
        } else {
          message.reply("Insuficcient perms, man. Nice try.");
          console.log("Attempted by ID: "+message.author.tag);
        }
        break;

      case "unban":
        if (message.member.permissions.has("BAN_MEMBERS")) {
          message.reply("yeah sorry, <@337437436680339457> says (and i quote) \"This is way too hard to program, hell nah.\", so just do it through the server settings for now");
        } else {
          message.reply("Insuficcient perms, man. Nice try.");
          console.log("Attempted by ID: "+message.author.tag);
        }
        break;

      case "lockdown":
        if (message.member.permissions.has("MANAGE_MESSAGES")) {
          message.channel.overwritePermissions("385480119134715919", {SEND_MESSAGES: false}).catch(error => message.reply(`Couldn't lock channel because of: ${error}`));
          message.channel.send(":lock: Channel's been locked.");
        } else {
          message.reply("Insuficcient perms, man. Nice try.");
          console.log("Attempted by ID: "+message.author.tag);
        }
        break;

        case "unlock":
          if (message.member.permissions.has("MANAGE_MESSAGES")) {
            message.channel.overwritePermissions("385480119134715919", {SEND_MESSAGES: true}).catch(error => message.reply(`Couldn't unlock channel because of: ${error}`));
            message.channel.send(":unlock: Channel's been unlocked.");
          } else {
            message.reply("Insuficcient perms, man. Nice try.");
            console.log("Attempted by ID: "+message.author.tag);
          }
          break;

        case "purge":
          if (message.member.permissions.has("MANAGE_MESSAGES")) {
            if(command[1]==null){message.reply("Not enough parameters!");break;}
            const deleteCount = parseInt(command[1], 10);
            if(!deleteCount || deleteCount < 2 || deleteCount > 100){
              message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
              break;
            }
            message.channel.fetchMessages({limit: deleteCount+1}).then(messages => {
              message.channel.bulkDelete(messages);
            }).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
            message.reply("Purged the chat of the last "+deleteCount+" messages!\n*[This message will self destruct in 5 seconds...]*");
            console.log(message.channel.lastMessageID);
            setTimeout(function(){
              client.user.lastMessage.delete();
            }, 5000)
          } else {
            message.reply("Insuficcient perms, man. Nice try.");
            console.log("Attempted by ID: "+message.author.tag);
          }
          break;


        case "alert_stream":
          if(message.member.roles.find("notifyme") != null){
            message.member.addRole("notifyme");
          }else{
            message.reply("you already have this role!")
          }
          break;

        case "announce":
        case "ann":
          var embedAnn = new Discord.RichEmbed()
              .setTitle("Announcement from "+issuer+"\n")
              .setDescription(command.slice(1).join(" "))
              .setColor(0xcbb778)
              .setFooter(date);
          client.channels.find("name", "team-news").send(embedAnn);
          break;



        // Ugly Commands start here

        case "help":
          var embedhelpmember = new Discord.RichEmbed() // sets a embed box to the variable embedhelpmember
              .setTitle("**List of Commands**\n") // sets the title to List of Commands
              .addField(" !ping", "Pong!") // sets the first field to explain the command *help
              .addField(" !pong", "Ping!") // sets the field information about the command *info
              .addField(" !rules", "Displays the server rules in chat.")
              .addField(" !help", "Need some help?")
              .setColor(0xFFFFFF) // sets the color of the embed box to orange
              .setFooter("You need help, do you?"); // sets the footer to "You need help, do you?"
          var embedhelpadmin = new Discord.RichEmbed() // sets a embed box to the var embedhelpadmin
              .setTitle("**List of Mod Commands**\n") // sets the title
              .addField(" !ban [@user]", "Bans a user for 1 day")
              .addField(" !kick [@user] [reason]", "Kicks a user")
              .addField(" !unban [@user]", "¯\\_(ツ)_/¯")
              .addField(" !lockdown", "Locks down a channel so people with no roles cannot talk")
              .addField(" !unlock", "Unlocks a previously Locked channel")
              .addField(" !purge [#]", "Purges a channel of a specified amount of messages")
              .addField(" !changelog", "Display changelog for the most recent version of the bot.")
              .setColor(0xFF0000) // sets a color
              .setFooter("Ooo, a mod!"); // sets the footer

          message.reply("here are some commands!");
          message.channel.send(embedhelpmember); // sends the embed box "embedhelpmember" to the chatif
          if(message.member.permissions.has("MANAGE_MESSAGES")){message.channel.send(embedhelpadmin);} // if member is a botadmin, display this too
          break;

        case "rules":
        if (message.member.permissions.has("MANAGE_MESSAGES")) {
          var embedRules = new Discord.RichEmbed()
                .setTitle("------- [ Server Rules ] -------\n")
                .addField(" 1. Read the Rules", "• Read all the rules before participating in chat. Not reading the rules is not an excuse for breaking them.\n• It's suggested that you read channel topics and pins before asking questions as well, as some questions may have already been answered in those.\n• #general is for team-related or competition-related chat. I ask you keep low-quality content like memes out of here please.\n• #news is for us getting announcements out to you all.​ Streams, announcements... The works.\n• #off-topic is for, you guessed it, off topic stuff. And yes, you can post memes here. Knock yourself out.")
                .addField(" 2. Be nice to each other", "• It's fine to disagree, it's not fine to insult or attack other people.\n• You may disagree with anyone or anything you like, but you should try to keep it to opinions, and not people. Avoid vitriol.\n• Constant antagonistic behavior is considered uncivil and appropriate action will be taken.\n• Don't brigade, raid, or otherwise attack other people or communities. Don't discuss participation in these attacks. This may warrant an immediate permanent ban.")
                .addField(" 3. Taking Action", "• If you have concerns about another user, please take up your concerns with a staff member (someone with the \"admin\" or \"mod\" role in the sidebar) in private.\n• Don't publicly call other users out.")
                .addField(" 4. Don't spam", "• For excessively long text, use a service like '0bin' or 'pastebin.'")
                .addField(" 5. Don't be sneaky", "• Trying to evade, look for loopholes, or stay borderline within the rules will be treated as breaking them, and appropriate action will be taken.")
                .addField(" 6. (Not to be cliché, but) Have fun!", "• We're here to play video games, not be rule nazis. Stay within the rules, and we'll be fine!")
                .setColor(0x00b2b2)
                .setFooter("Welcome to the Discord!");
          message.channel.send(embedRules);
        } else {
          message.reply("Insuficcient perms, man. Nice try.");
          console.log("Attempted by ID: "+message.author.tag);
        }
          break;

        case "changelog":
          if(message.member.permissions.has("MANAGE_ROLES")){
            var embedChangelog = new Discord.RichEmbed()
                .setTitle("**Changelog**\n")
                .addField(" Version "+bot.version, bot.changelog+"\n\nSee the github repo for the full changelog")
                .setColor(0xFFA500)
                .setFooter("Documentation is fun.");
            message.channel.send(embedChangelog);
          } else {
            message.reply("Insuficcient perms, man. Nice try.");
            console.log("Attempted by ID: "+message.author.tag);
          }
          break;

        default:
          message.reply("Either I just encountered a bug, or that command doesnt exist yet. Please contact an admin for help.");
          console.log("Error occurred: Command doesn't exist");
    }
    console.log("----------");
  } else {
    return;
  }
});

//must be at end for some reason
client.login(bot.token);
