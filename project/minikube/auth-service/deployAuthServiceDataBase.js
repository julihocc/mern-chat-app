const { exec } = require('child_process');

function execShellCommand(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.warn(error);
				reject(error);
			}
			resolve(stdout ? stdout : stderr);
		});
	});
}

// Paths to your Kubernetes YAML files
const kubeFiles = [
	'./mongo_auth-deployment.yaml',
	'./mongo_auth-service.yaml',
	'./mongo_auth-pvc.yaml'
];

async function applyKubeConfigurations() {
	console.log("Deploying MongoDB for Auth Service...");

	for (const file of kubeFiles) {
		try {
			const output = await execShellCommand(`kubectl apply -f ${file}`);
			console.log(output);
		} catch (error) {
			console.error(`Error applying file ${file}:`, error);
		}
	}

	console.log("Deployment of Auth Service DataBase is complete.");
}

applyKubeConfigurations().then(r => console.log(r))
