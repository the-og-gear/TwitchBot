module.exports = {
	name: "ping",
	description: "Ping!",
	async run(client, target, userinfo, _context) {
		let p = await client.ping();
		client.say(target, `Ping complete in ${p*1000}ms!`);
		console.log(`* Ping by ${userinfo.username} complete in ${p*1000}ms`);
	}
}
