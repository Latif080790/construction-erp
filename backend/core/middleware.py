import json
import time
from django.utils import timezone
from django.conf import settings

class APILoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip logging for non-API requests
        if not request.path.startswith('/api/'):
            return self.get_response(request)

        # Start timer
        start_time = time.time()

        # Process request
        response = self.get_response(request)

        # Calculate request duration
        duration = time.time() - start_time

        # Prepare log data
        log_data = {
            'timestamp': timezone.now().isoformat(),
            'method': request.method,
            'path': request.path,
            'user': str(request.user),
            'status_code': response.status_code,
            'duration': duration,
            'ip': self.get_client_ip(request)
        }

        # Log request data if it's a POST/PUT/PATCH
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                log_data['request_body'] = json.loads(request.body)
            except json.JSONDecodeError:
                log_data['request_body'] = str(request.body)

        # Log the data (you can customize this part based on your needs)
        if settings.DEBUG:
            print(json.dumps(log_data, indent=2))

        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')
