# Port forward for Grafana
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring

# Port forward for Prometheus
kubectl port-forward svc/prometheus-server 9090:80 -n monitoring
