function createCommandList() {
	const path = require('path');
	const fs = require('fs');
	let tmp = new Map();
	let files = fs.readdirSync(path.join(__dirname, 'Commands')).filter(file=>file.endsWith('.js'));

	for (let f of files) {
		let c = require(path.join(__dirname, 'Commands', f));
		tmp.set(c.name, c);
	}

	return tmp;
}

async function handle(client, command, target, userinfo) {
	const fs = require('fs');
	const path = require('path');
	if (!command.startsWith('!')) { return; }

	let c = command.split(' ');

	try {
		client.command_list.get(c[0].substring(1)).run(client, target, userinfo, c.slice(1));
	} catch(e) {
		console.log(`Error in command ${command}! Trace:\n${e}`);
	}
}

module.exports.handle = handle;
module.exports.createCommandList = createCommandList;
