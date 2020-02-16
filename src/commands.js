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

async function handle(client, command, target, _context) {
	const fs = require('fs');
	const path = require('path');
	if (!command.startsWith('!')) { return; }

	let cooldowns = JSON.parse(fs.readFileSync(path.join(__dirname, 'Commands', 'cooldowns.json')));

	if (cooldowns[_context.username]) { cooldowns = cooldowns[_context.username]; }
	else { cooldowns = null; }

	try {
		client.command_list.get(command.substring(1)).run(client, target, _context, cooldowns);
	} catch(e) {
		console.log(`Error in command ${command}! Trace:\n${e}`);
	}
}

function updateTimer(clientname, command, time) {
	const fs = require('fs');
	const path = require('path');

	let cooldowns = JSON.parse(fs.readFileSync(path.join(__dirname, 'Commands', 'cooldowns.json')));

	if (!cooldowns[clientname]) { cooldowns[clientname] = {}; }
	if (!cooldowns[clientname][command]) { cooldowns[clientname][command] = {}; }

	cooldowns[clientname][command].date = time;
	cooldowns[clientname][command].warning = false;

	fs.writeFileSync(path.join(__dirname, 'Commands', 'cooldowns.json'), JSON.stringify(cooldowns, null, 4));
	console.log(`* Cooldown for ${command} updated for ${clientname}`);
}

function updateWarning(clientname, command) {
	const fs = require('fs');
	const path = require('path');

	let cooldowns = JSON.parse(fs.readFileSync(path.join(__dirname, 'Commands', 'cooldowns.json')));

	if (!cooldowns[clientname]) { cooldowns[clientname] = {}; }
	if (!cooldowns[clientname][command]) { cooldowns[clientname][command] = {}; }

	cooldowns[clientname][command].warning = true;

	fs.writeFileSync(path.join(__dirname, 'Commands', 'cooldowns.json'), JSON.stringify(cooldowns, null, 4));
	console.log(`* Warned ${clientname} for ${command} spam!`);
}

module.exports.handle = handle;
module.exports.createCommandList = createCommandList;
module.exports.updateTimer = updateTimer;
module.exports.updateWarning = updateWarning;
