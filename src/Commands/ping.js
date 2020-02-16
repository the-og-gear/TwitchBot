module.exports = {
	name: "ping",
	description: "Ping!",
	cooldown:5000, // Cooldown in ms
	async run(client, target, context, cd) {
		const path = require('path');
		let D = new Date();
		if (cd) {
				if (new Date(cd.ping.date).getTime() >= D.getTime()) {
					if (!cd.ping.warning) {
						client.say(target, "Error! This command is on cooldown for you!");
						require(path.join(__dirname, '..', 'commands.js')).updateWarning(context.username, 'ping');
						return;
					}
					return;
				}
		}
		client.say(target, "Pong!");
		require(path.join(__dirname, '..', 'commands.js')).updateTimer(context.username, 'ping', new Date(D.getTime() + this.cooldown));
		console.log(`* Ping by ${context.username} complete in ${new Date() - new Date(context["tmi-sent-ts"])}ms`);
	}
}
