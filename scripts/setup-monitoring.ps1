# Install Chocolatey if not installed
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install kubectl
choco install kubernetes-cli -y

# Install Helm
choco install kubernetes-helm -y

# Install Prometheus and Grafana
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace

# Install metrics-server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Create port-forward script
@"
# Port forward for Grafana
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring

# Port forward for Prometheus
kubectl port-forward svc/prometheus-server 9090:80 -n monitoring
"@ | Out-File -FilePath "start-monitoring.ps1"
