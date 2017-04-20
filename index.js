const port = 25;
const ms = require('smtp-tester');
const numEmails = 0;


const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

var time

if (cluster.isMaster) {
	console.log(`Master ${process.pid} is running`);

	function messageHandler(msg) {
		if (msg.cmd && msg.cmd === 'emailReceived') {
			if(!time){
				time = process.hrtime();
			}
			numEmails += 1;
			console.log("NUM EMAILS =        " + numEmails);
			console.log("Emails per minute = " + numEmails/time[0]*60);
		}
	}

	// Fork workers.
	const numCPUs = require('os').cpus().length;
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	for (const id in cluster.workers) {
		cluster.workers[id].on('message', messageHandler);
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
	});
} else {

	mailServer = ms.init(port);
	handler = function (addr, id, email) {
		console.log('recieved message');
		process.send({
			cmd: 'emailReceived'
		});
	};
	mailServer.bind(handler);

	console.log(`Worker ${process.pid} started`);
}