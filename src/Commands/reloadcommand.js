async function reloadByName(client, target, command, output) {
	const path = require('path');
	const fs = require('fs');

	// Remove the command from the client command list
	client.command_list.delete(command);

	// Iterate through the file list to find the command
	let files = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith('.js'));

	for (let f of files) {
		let c = require(path.join(__dirname, f));
		if (c.name === command) {
			c = null;
			delete require.cache[require.resolve(path.join(__dirname, f))];

			// Reload command and add it back to the command list
			c = require(path.join(__dirname, f));
			client.command_list.set(c.name, c);
			output ? client.say(target, `${command} successfully reloaded.`) : null;
			console.log(`* ${command} reloaded by name`);
			return;
		}
	}

	delete files;
	output ? client.say(target, `${command} was unable to be reloaded.`) : null;
}

async function reloadByFile(client, target, file) {
	const path = require('path');
	const fs = require('fs');

	// Make sure the file exists, append .js if it isn't there already
	let p = path.join(__dirname, file.includes('.js') ? file : file+'.js');
	if (!fs.existsSync(p)) {
		client.say(target, `${file} doesn't exist. It is unable to be reloaded.`);
	}

	// Delete the command from the client, assuming it exists.
	let name = require(p).name;
	client.command_list.delete(name);

	// Reload the command
	name = null;
	delete require.cache[require.resolve(p)];
	c = require(p);
	client.command_list.set(c.name, c);
	client.say(target, `${file} successfully reloaded.`);
	console.log(`* ${file} reloaded by file`);
}

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

module.exports = {
	name: "reloadcommand",
	description: "Reloads a command. Possible flags are -f and -n",
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
