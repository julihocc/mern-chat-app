const { exec } = require("child_process");

const commands = [
    'minikube stop',
    'minikube start',
    'minikube addons enable ingress',
    '& minikube -p minikube docker-env | Invoke-Expression',
    'docker build -t jdk2py/backend:latest ./backend',
    'docker tag jdk2py/backend:latest jdk2py/backend:latest',
    'docker push jdk2py/backend:latest',
    'docker pull jdk2py/backend:latest',
    'docker build -t jdk2py/frontend:latest ./frontend',
    'docker tag jdk2py/frontend:latest jdk2py/frontend:latest',
    'docker push jdk2py/frontend:latest',
    'docker pull jdk2py/frontend:latest',
    'kubectl delete -f mongo.yaml',
    'kubectl delete -f backend.yaml',
    'kubectl delete -f frontend.yaml',
    'kubectl apply -f mongo.yaml',
    'kubectl apply -f backend.yaml',
    'kubectl apply -f frontend.yaml',
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
