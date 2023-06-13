const { exec } = require("child_process");

const commands = [
    'minikube stop',
    'minikube start',
    'minikube addons enable ingress',
    '& minikube -p minikube docker-env | Invoke-Expression',
    'docker build -t jdk2py/server:latest ./server',
    'docker tag jdk2py/server:latest jdk2py/server:latest',
    'docker push jdk2py/server:latest',
    'docker pull jdk2py/server:latest',
    'docker build -t jdk2py/client:latest ./client',
    'docker tag jdk2py/client:latest jdk2py/client:latest',
    'docker push jdk2py/client:latest',
    'docker pull jdk2py/client:latest',
    'kubectl delete -f mongo-deployment.yaml',
    'kubectl delete -f backend-deployment.yaml',
    'kubectl delete -f frontend-deployment.yaml',
    'kubectl apply -f mongo-deployment.yaml',
    'kubectl apply -f backend-deployment.yaml',
    'kubectl apply -f frontend-deployment.yaml',
    'kubectl get pods',
    'kubectl get services',
];

commands.forEach((command) => {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
});
