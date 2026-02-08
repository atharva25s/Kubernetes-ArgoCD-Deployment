# KinD-deployment-with-ArgoCD

## Hardware Setup
- Initialize an EC2 instance or any virtual machine.
- Prefer OS `Linux 22.04 LTS` or `Linux 24.04 LTS`
- Disk size >= 20GB
- Login into VM `Bastion` or `SSH`
- Update the OS
```bash
sudo apt update
```
- Install the Docker since we are using *KinD(Kubernetes in Docker)*
```bash
sudo apt install docker.io -y
```
- Run this command
```bash
sudo usermod -aG docker $USER && newgrp docker
```

---

## Kubernetes Setup

### 0. Create folder `k8s-kind`
```bash
mkdir k8s-kind
cd k8s-kind
```

### 1. Install KinD
- Copy and execute [install_kind.sh](KinD-cluster\install_kind.sh)
```bash
vim install_kind.sh
```
```bash
chmod +x install_kind.sh
```
```bash
./install_kind.sh
```
- Verify
``` bash
kind --version
```

### 2. Create KinD Cluster
- Copy [config.yml](KinD-cluster\config.yml)
```bash
vim config.yml
```
- Creating cluster of **3 Nodes** *1 Control-plane & 2 Worker-nodes*
```bash
kind create cluster --config=config.yml --name=test-cluster
```

### 3. Install kubectl
- Copy and execute [install_kubectl.sh](KinD-cluster\install_kubectl.sh)
```bash
vim install_kubectl.sh
```
```bash
chmod +x install_kubectl.sh
```
```bash
./install_kubectl.sh
```
- Verify
``` bash
kubectl get nodes
docker ps
```

---

## Argo CD Setup
- Create a namespace for Argo CD:
```bash
kubectl create namespace argocd
```

- Apply the Argo CD manifest:
```bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

- Check services in Argo CD namespace:
```bash
kubectl get pods -n argocd
kubectl get svc -n argocd
```

- Expose Argo CD server using NodePort:
```bash
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
```

- Forward ports to access Argo CD server:
```bash
kubectl port-forward -n argocd service/argocd-server 8443:443 --address=0.0.0.0 &
```

- Accessing the password
```bash
kubectl get secret -n argocd argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo
```
---

## Nginx Ingress Setup for Kubernetes
- Install Ingress-Nginx
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
```
- Verify
``` bash
kubectl get pods -n ingress-nginx -o wide
```
- `NOTE : To make Nginx Ingress Availble to the browser we need to take it to Control-plane Node as only Control-Plane has extra port mapping`
- Label the Control Plane Node: *The Ingress manifest for KinD looks for a specific label to decide where to land.*
```bash
kubectl label node test-cluster-control-plane ingress-ready=true
```
- Patch the Ingress Deployment: *You need to ensure the NGINX deployment has a `nodeSelector` for the control plane and is using `hostPort`.*
```bash
kubectl patch deployment ingress-nginx-controller -n ingress-nginx --type=json -p='[{"op": "add", "path": "/spec/template/spec/nodeSelector", "value": {"kubernetes.io/hostname": "test-cluster-control-plane"}}]'
```
- For watching logs Ingress
```bash
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller
```

---


#### For Debugging

- Temporary port-forwading backend service
```bash 
sudo kubectl port-forward svc/backend-car-app-service 8000:80 --address 0.0.0.0 &
```
- Temporary port-forwading frontend service
```bash 
sudo kubectl port-forward svc/frontend-car-app-service 80:80 --address 0.0.0.0 &
```
- Kubernetes pods and workers 
```bash
kubectl get pods -o wide -n ingress-nginx
kubectl get pods -o wide -n argocd
kubectl get pods -o wide
```

- Kubernetes Services
```bash
kubectl get svc
kubectl get svc -n argocd
kubectl get svc -n ingress-nginx
```
