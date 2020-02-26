/**
 *	Function to reload commands with a passed name
 *	More expensive than reloadByFile, must search for a filepath
 */
async function reloadByName(client, target, command, output) {
	const path = require('path');
	const fs = require('fs');

	// Iterate through the file list to find the command
	let files = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith('.js'));

	for (let f of files) {
		let c = require(path.join(__dirname, f)).name;
		if (c === command) {
			deleteFromClient(client, f, true, output);
			return;
		}
	}

	output ? client.say(target, `${command} was unable to be reloaded.`) : null;
}

/**
 *	Function to reload commands with a passed filename
 *	Ensures a filename check is done to prevent errors
 */
async function reloadByFile(client, target, file, output) {
	const path = require('path');
	const fs = require('fs');

	// Make sure the file exists, append .js if it isn't there already
	let p = path.join(__dirname, file.includes('.js') ? file : file+'.js');
	if (!fs.existsSync(p)) {
		output ? client.say(target, `${file} doesn't exist. It is unable to be reloaded.`) : null;
	}

	// Delete the command, reload it afterwards
	deleteFromClient(client, p.split('.js')[0], true, output);
}

/**
 *	Function to reload all commands.
 *	Calls reloadByName for every key in client.command_list
 */
async function reloadAllCommands(client, target) {
	// Deceptively simple function.
	// Iterate through the client command list and reload each one by name
	let cl = new Map();
	for (let m in client.command_list) {
		cl.set(m.name, m);
	}
	for (let [key, value] of cl) {
		cl.delete(key);
		reloadByName(client, target, key, false);
	}

	client.say(target, 'All commands successfully reloaded.');
	console.log('* All commands reloaded');
}

/**
 *	Add a command to the require cache and client
 *	Outputs statement to chat only if output is true
 */
async function addToClient(client, file, output) {
	const path = require('path');

	let c = require(path.join(__dirname, file));
	client.command_list.set(c.name, c);
	console.log(`* Command ${c.name} successfully loaded.`);
	output ? client.say(target, `Command ${c.name} successfully loaded.`) : null;
}

/**
 *	Delete a command from the require cache and client
 *	Only need output if add is true
 */
async function deleteFromClient(client, file, add, output) {
	const path = require('path');

	let tmp = require(path.join(__dirname, file+'.js')).name;
	delete require.cache[require.resolve(path.join(__dirname, file+'.js'))];
	client.command_list.delete(tmp);

	add ? addToClient(client, file, output) : return;
}

/**
 *	Command export object
 *	Used to add command to the bot
 */
module.exports = {
	name: "reloadcommand",
	description: "Reloads a command. Possible flags are -f, -n, and -a",
	cooldown: 0,
	async run(client, target, userinfo, context) {
		const OUTPUT = true;
		console.log(`* ${userinfo.username} is reloading a command`);

		switch (context[0]) {
			case '-n':
				client.say(target, `Attempting to reload command ${context[1]} by name...`);
				reloadByName(client, target, context[1], OUTPUT);
				break;

			case '-f':
				client.say(target, `Attempting to reload command ${context[1]} by filename...`);
				reloadByFile(client, target, context[1]);
				break;

			case '-a':
				client.say(target, `Attempting to reload all commands...`);
				reloadAllCommands(client, target);
				break;

			default:
				// Default to reloading by name if it isn't known to be a file
				if (context[0].includes('.js')) {
					client.say(target, `Attempting to reload command ${context[0]} by filename...`);
					reloadByFile(client, taget, context[0]);
				} else {
					client.say(target, `Attempting to reload command ${context[0]} by name...`);
					reloadByName(client, target, context[0], OUTPUT);
				}
		}
	}
}
