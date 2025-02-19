from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API endpoints
    path('api/projects/', include('apps.projects.urls')),
    path('api/finance/', include('apps.finance.urls')),
    path('api/resources/', include('apps.resources.urls')),
    path('api/hr/', include('apps.hr.urls')),
    path('api/documents/', include('apps.documents.urls')),
    path('api/quality/', include('apps.quality.urls')),
    path('api/reports/', include('apps.reports.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
