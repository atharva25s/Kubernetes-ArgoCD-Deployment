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


- Temporary command
```bash 
sudo kubectl port-forward svc/backend-car-app-service 8000:80 --address 0.0.0.0 &
```
