# Fungsi untuk logging
function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    Write-Host $logMessage
    Add-Content -Path "monitoring.log" -Value $logMessage
}

# Fungsi untuk memeriksa prerequisites
function Check-Prerequisites {
    Write-Log "Memeriksa prerequisites..."
    
    # Cek PowerShell version
    $psVersion = $PSVersionTable.PSVersion
    Write-Log "PowerShell Version: $psVersion"
    
    # Cek apakah running as admin
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    Write-Log "Running as Administrator: $isAdmin"
    if (-not $isAdmin) {
        Write-Log "WARNING: Script sebaiknya dijalankan sebagai Administrator"
    }
    
    # Cek kubectl
    try {
        $kubectlVersion = kubectl version --client
        Write-Log "kubectl terinstall: $kubectlVersion"
    }
    catch {
        Write-Log "ERROR: kubectl tidak ditemukan"
        return $false
    }
    
    return $true
}

# Fungsi untuk memeriksa koneksi
function Test-Connection {
    param($Port)
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $tcp.ConnectAsync("localhost", $Port).Wait(1000)
        $tcp.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Fungsi untuk memulai monitoring
function Start-Monitoring {
    Write-Log "Memulai layanan monitoring..."
    
    # Cek apakah port sudah digunakan
    if (Test-Connection -Port 3000) {
        Write-Log "WARNING: Port 3000 sudah digunakan"
    }
    if (Test-Connection -Port 9090) {
        Write-Log "WARNING: Port 9090 sudah digunakan"
    }
    
    try {
        # Start Grafana
        Write-Log "Memulai Grafana pada port 3000..."
        Start-Process powershell -ArgumentList "kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring" -WindowStyle Hidden
        
        # Start Prometheus
        Write-Log "Memulai Prometheus pada port 9090..."
        Start-Process powershell -ArgumentList "kubectl port-forward svc/prometheus-server 9090:80 -n monitoring" -WindowStyle Hidden
        
        # Tunggu dan verifikasi
        Start-Sleep -Seconds 5
        if (Test-Connection -Port 3000) {
            Write-Log "SUCCESS: Grafana berhasil dimulai"
        }
        if (Test-Connection -Port 9090) {
            Write-Log "SUCCESS: Prometheus berhasil dimulai"
        }
        
        Write-Log "Informasi akses:"
        Write-Log "- Grafana: http://localhost:3000 (admin/prom-operator)"
        Write-Log "- Prometheus: http://localhost:9090"
    }
    catch {
        Write-Log "ERROR: Gagal memulai layanan monitoring: $_"
    }
}

# Main script
Clear-Host
Write-Log "=== Memulai Sistem Monitoring ==="

if (Check-Prerequisites) {
    Start-Monitoring
}
else {
    Write-Log "ERROR: Prerequisites tidak terpenuhi"
    Write-Log "Silakan ikuti panduan troubleshooting di README.md"
}
