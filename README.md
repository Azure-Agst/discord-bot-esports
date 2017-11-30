# SJPII eSports Discord Bot

## How to use

For some reason the node_modules folder committed and I was too lazy to remove it, so all dependencies are already installed. Just make sure you have node 6.12.0 installed and use `node start.js` to start the bot locally.

If running using heroku, I’ve already put a Procfile in the repo, so just push to heroku or sync the github repo, and use the dashboard to start the worker.

If running using a spare computer or server you own, I recommend installing and using `tmux` to create a vm, start it using `node start.js`, and then detaching from the VM by pressing Ctrl-B and then D. Your bot should keep running in the background.

## How to modify

Most the modifiable data is located in ./bot.json. 

- Name: Bot name used internally
- Version: Version of the bot.
- Prefix: The 1 character prefix to look for with commands
- Token: The token you get from the discord development pamel
- Changelog: What is loaded as the description when you run !Changelog

Commands are stored in arrays. `Command[0]` is the command, and everything from `command[1]` onwards are the params.

The switch statement is the main brain of the bot, it checks “command[0]” for a keyword. Simply add a case to add a command,and make sure you signify the end with `break;`

## Other Stuff

This bot uses [Discord.js](https://github.com/hydrabolt/discord.js/). You can read the documentation [here](https://discord.js.org/#/docs/main/stable/general/welcome).