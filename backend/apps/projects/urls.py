from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet)
router.register(r'phases', views.PhaseViewSet)
router.register(r'tasks', views.TaskViewSet)
router.register(r'risks', views.RiskViewSet)
router.register(r'documents', views.ProjectDocumentViewSet)
router.register(r'progress', views.ProgressViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
