module.exports = {
	name: "mods",
	description: "Get the moderator list for the channel",
	cooldown: 10000, // Cooldown in ms
	async run(client, target, context, cooldown) {
		const path = require('path');
		let D = new Date();
		if (cooldown) {
			if (new Date(cooldown.mods.date).getTime() >= D.getTime()) {
				if (!cooldown.mods.warning) {
					client.say(target, "Error! This command is on cooldown for you!");
					require(path.join(__dirname, '..', 'commands.js')).updateWarning(context.username, 'mods');
					return;
				}
				return;
			}
		}
		let mods = await client.mod(target).resolve();
		let str = "List of moderators: ";
		for (let i = 0; i < mods.length - 1; i++) {
			str += mods[i] + ', ';
		}
		str += mods[mods.length - 1];
		client.say(target, str);
		require(path.join(__dirname, '..', 'commands.js')).updateTimer(context.username, 'mods', new Date(D.getTime() + this.cooldown));
		console.log(`* Mods listed by ${context.username}`);
	}
}
