const port = 25;
const ms = require('smtp-tester');
var numEmails = 0;


const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

var time, previousTime 

if (cluster.isMaster) {
	console.log(`Master ${process.pid} is running`);

	function messageHandler(msg) {
		if (msg.cmd && msg.cmd === 'emailReceived') {
			if(!time){
				time = process.hrtime();
				previousTime = process.hrtime();
				console.log("First email recieved!");
				return;
			}
			numEmails += 1;
			//only print once per second at max
			timeDiff = process.hrtime(previousTime)[0];
			if(timeDiff < 1){
				return;
			}
			console.log(timeDiff);
			previousTime = process.hrtime();
			console.log("NUM EMAILS =            " + numEmails);
			console.log("Avg emails per minute = " + numEmails/process.hrtime(time)[0]*60);
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
	//	console.log('recieved message');
		process.send({
			cmd: 'emailReceived'
		});
	};
	mailServer.bind(handler);

	console.log(`Worker ${process.pid} started`);
}