# Minikube deployment

```
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-service.yaml
kubectl apply -f mongodb-deployment.yaml

docker build -t jdk2py/backend:latest ./backend
docker tag jdk2py/backend:latest jdk2py/backend:latest
docker push jdk2py/backend:latest
docker pull jdk2py/backend:latest

kubectl delete -f ./miniback.yaml
kubectl apply -f ./miniback.yaml

docker build -t jdk2py/frontend:latest ./frontend
docker tag jdk2py/frontend:latest jdk2py/frontend:latest
docker push jdk2py/frontend:latest
docker pull jdk2py/frontend:latest

kubectl delete -f ./minifront.yaml
kubectl apply -f ./minifront.yaml

kubectl get deployments
kubectl get services
kubectl get ingress

minikube tunnel
```

Backend will be available at http://localhost:4000/graphql and frontend at http://localhost:3000
