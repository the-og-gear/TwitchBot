const path = require('path');
const tmi = require('tmi.js');

require('dotenv').config();

// Client options
const options = {
	options: { debug: process.env.NODE_ENV==="production" ? false : true },
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: 'steampipe_network',
		password: process.env.OAUTH_KEY
	},
	channels: [
		'the_og_gear'
	]
};

// Create client
const client = new tmi.client(options);

// Register event handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.command_list = require(path.join(__dirname, 'commands.js')).createCommandList();

// Connect to Twitch
client.connect();

// Message handler
function onMessageHandler(target, context, msg, self) {
	if (self) { return; } // Ignore bot messages

	// Remove whitespace from message
	let commandname = msg.trim();

	// Pass to command handler for processing
	require(path.join(__dirname, 'commands.js')).handle(client, commandname, target, context);
}

// Connected handler
function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
}
