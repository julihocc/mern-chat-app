const { exec } = require('child_process');

// Function to execute a shell command
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

// Paths to your Kubernetes YAML files for the auth service
const kubeFiles = [
	'./auth_service.yaml',
	'./auth_service-deployment.yaml'
];

// Function to apply Kubernetes configurations
async function applyKubeConfigurations() {
	console.log("Deploying Auth Service...");

	for (const file of kubeFiles) {
		try {
			const output = await execShellCommand(`kubectl apply -f ${file}`);
			console.log(output);
		} catch (error) {
			console.error(`Error applying file ${file}:`, error);
		}
	}

	console.log("Deployment of Auth Service components is complete.");
}

// Run the deployment function
applyKubeConfigurations();