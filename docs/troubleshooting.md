# Panduan Troubleshooting Monitoring

## Masalah Umum

### 1. Script Tidak Dapat Dijalankan
```powershell
# Error: "... cannot be loaded because running scripts is disabled"
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Port Sudah Digunakan
```powershell
# Cek proses yang menggunakan port
netstat -ano | findstr :3000
netstat -ano | findstr :9090

# Hentikan proses (ganti XXXX dengan PID)
taskkill /PID XXXX /F
```

### 3. Kubectl Tidak Ditemukan
1. Install kubectl:
```powershell
choco install kubernetes-cli
```

2. Verifikasi instalasi:
```powershell
kubectl version --client
```

### 4. Docker Tidak Ditemukan
1. Download dan install Docker Desktop dari https://www.docker.com/products/docker-desktop
2. Pastikan Windows Subsystem for Linux (WSL) terinstall
3. Restart komputer

### 5. Grafana Tidak Dapat Diakses
1. Cek status port-forward:
```powershell
kubectl get pods -n monitoring
kubectl describe pod prometheus-grafana-XXXXX -n monitoring
```

2. Restart port-forward:
```powershell
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring
```

### 6. Prometheus Tidak Dapat Diakses
1. Cek status Prometheus:
```powershell
kubectl get pods -n monitoring | grep prometheus
```

2. Lihat logs:
```powershell
kubectl logs prometheus-server-XXXXX -n monitoring
```

## Langkah Reset

### Reset Kubectl
```powershell
kubectl delete namespace monitoring
kubectl create namespace monitoring
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
```

### Reset Docker
```powershell
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker network prune -f
```

## Tips

1. Selalu jalankan PowerShell sebagai Administrator
2. Pastikan semua port yang diperlukan (3000, 9090) tidak digunakan
3. Gunakan script detailed-monitoring.ps1 untuk logging lengkap
4. Cek file log (monitoring.log, docker-monitoring.log) untuk detail error
5. Jika menggunakan Docker, pastikan Docker Desktop berjalan

## Kontak Support

Jika masalah masih berlanjut:
1. Kirim file log ke tim support
2. Sertakan output dari:
   - `kubectl version`
   - `docker version`
   - `systeminfo`
3. Jelaskan langkah-langkah yang sudah dicoba
