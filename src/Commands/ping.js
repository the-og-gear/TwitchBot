module.exports = {
	name: "ping",
	description: "Ping!",
	async run(client, target, context) {
		let p = await client.ping();
		client.say(target, `Ping complete in ${p*1000}ms!`);
		require(path.join(__dirname, '..', 'commands.js')).updateTimer(context.username, 'ping', new Date(D.getTime() + this.cooldown));
		console.log(`* Ping by ${context.username} complete in ${p*1000}ms`);
	}
}
