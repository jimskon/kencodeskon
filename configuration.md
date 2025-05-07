# Overview

This documentation will outline the commands and softwares necessary for running each piece of the project. Eclipse-Che states that single-node kubernetes framework will work for testing and development, but this part of the project should be moved to a cloud infrastructure for production. These instructions will assume a fresh instance of Ubuntu Noble 24.04 for each system. This guide should perfectly match the commands and order used on the test system, and must be updated when new software is installed.

## API Server
This server houses the Eclipse-Che architecture and interacts with the main app via an API.
### Minimal Requirements

- 2 or more CPU's

- 2GB or more of free memory

- 20GB or more of free disk space

### Setup

### 1. Install Docker
For this we followed the guide [here](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) but the important thing is that we meet the prerequisites for Minikube, which it states as: 

> A container or virtual machine manager, such as: Docker, QEMU, Hyperkit, Hyper-V, KVM, Parallels, Podman, VirtualBox, or VMware Fusion/Workstation

The steps are then: 

- Setup Docker's `apt` repository
    ```sh
    # Add Docker's official GPG key:
    sudo apt-get update
    sudo apt-get install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    ```

- Install Docker

    ```sh
    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ```

- Test Docker

    ```sh
    sudo docker run hello-world
    ```

### 2. Install Minikube

For minikube we use the guide found [here](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download), and take the Binary Download route.

- Install Package
    ```sh
    curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
    sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
    ```
- Allow Docker access
    ```sh 
    sudo usermod -aG docker $USER && newgrp docker
    bash
    ```


- Start Cluster
    ```sh
    minikube start
    ```
    This step will run minikube and install kubernetes, and should encounter any errors that occurred during installation. When it runs successfully, the final message is 
    `🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default`

### 3. Install kubectl
For this step we use the guide [here](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-using-native-package-management) and opt for the apt package install method.

- Update the `apt` package index and install packages needed to use the Kubernetes `apt` repository:

    ```sh
    sudo apt update
    # apt-transport-https may be a dummy package; if so, you can skip that package
    sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
    ```
- Download the public signing key for the Kubernetes package repositories. The same signing key is used for all repositories so you can disregard the version in the URL:
    ```sh
    # If the folder `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
    # sudo mkdir -p -m 755 /etc/apt/keyrings
    curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.32/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
    sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg # allow unprivileged APT programs to read this keyring
    ```

- Add the appropriate Kubernetes apt repository
    ```sh
    # This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
    echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.32/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
    sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list   # helps tools such as command-not-found to work correctly
    ```
- Update apt package index, then install kubectl:
    ```sh
    sudo apt-get update
    sudo apt-get install -y kubectl
    ```

### 4. Install Chectl

For this step we use the guide [here](https://eclipse.dev/che/docs/stable/administration-guide/installing-the-chectl-management-tool/).

- Download and execute install script

    ```sh
    bash <(curl -sL  https://che-incubator.github.io/chectl/install.sh)
    ```

- Verify installation
    ```sh
    which chectl
    ```
    In response, the system should confirm the location as `usr/local/bin/chectl`

- Verify version
    ```sh
    chectl --version
    ```

- Read install logs
    ```sh
    cat chectl-install.log
    ```

### 5. Start Che

- Start Minikube with required add-ons and sufficient resources (These are the ideal resources from the Che website, feel free to modify within testing constraints.):
    ```sh
    minikube start --addons=ingress,dashboard --vm=true --memory=10240 --cpus=4 --disk-size=50GB 
    ```

- Create the Che instance:
    ```sh
    chectl server:deploy --platform minikube
    ```

- Verify the Che instance status:
    ```sh
    chectl server:status
    ```

### 6. Forward Ports

- The last command pointed to a url where the che dashboard is hosted.

- Requirements:
    - a firewall system to use for port forwarding, like UFW or iptables
    

- Navigate to the Che cluster instance:
    ```sh
    chectl dashboard:open
    ```


## React App Server

### 1. Install Node.js
```sh
sudo apt update
sudo apt install nodejs
node -v
```
After execution this should output the node version, which in our case should be `v18.19.1`

### 2. Install npm
```sh
sudo apt install npm
npm -v
```
The output should be `9.2.0`

### 3. Initialize App
After making a folder for the app to live in, the startup command is
```sh
npx create-react-app your-app-name
```
This command has been done in the github with a name of 'test'
During execution, npm made several warnings about the `create-react-app` command being deprecated, so perhaps there is something better.

### 4. Test Server
cd to the folder with the app name, and run `npm start`. This should launch a browser window showing the react homepage.