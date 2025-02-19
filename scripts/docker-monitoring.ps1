# Fungsi untuk logging
function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    Write-Host $logMessage
    Add-Content -Path "docker-monitoring.log" -Value $logMessage
}

# Fungsi untuk memeriksa Docker
function Check-Docker {
    Write-Log "Memeriksa Docker..."
    try {
        $dockerVersion = docker --version
        Write-Log "Docker terinstall: $dockerVersion"
        return $true
    }
    catch {
        Write-Log "ERROR: Docker tidak ditemukan"
        return $false
    }
}

# Fungsi untuk memulai container
function Start-MonitoringContainers {
    Write-Log "Memulai container monitoring..."
    
    try {
        # Buat network jika belum ada
        if (-not (docker network ls | Select-String "monitoring-network")) {
            Write-Log "Membuat docker network..."
            docker network create monitoring-network
        }
        
        # Start Prometheus
        Write-Log "Memulai Prometheus..."
        docker run -d `
            --name prometheus `
            --network monitoring-network `
            -p 9090:9090 `
            -v ${PWD}/prometheus.yml:/etc/prometheus/prometheus.yml `
            prom/prometheus
            
        # Start Grafana
        Write-Log "Memulai Grafana..."
        docker run -d `
            --name grafana `
            --network monitoring-network `
            -p 3000:3000 `
            -e "GF_SECURITY_ADMIN_PASSWORD=admin" `
            grafana/grafana
            
        Write-Log "Container berhasil dimulai!"
        Write-Log "Akses Grafana di: http://localhost:3000 (admin/admin)"
        Write-Log "Akses Prometheus di: http://localhost:9090"
    }
    catch {
        Write-Log "ERROR: Gagal memulai container: $_"
    }
}

# Fungsi untuk membersihkan
function Clean-Monitoring {
    Write-Log "Membersihkan container..."
    docker stop prometheus grafana
    docker rm prometheus grafana
    docker network rm monitoring-network
}

# Main script
Clear-Host
Write-Log "=== Memulai Monitoring dengan Docker ==="

if (Check-Docker) {
    # Bersihkan container lama jika ada
    Clean-Monitoring
    Start-MonitoringContainers
}
else {
    Write-Log "ERROR: Docker tidak terinstall"
    Write-Log "Silakan install Docker Desktop dari https://www.docker.com/products/docker-desktop"
}
