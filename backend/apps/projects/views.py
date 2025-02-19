from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, Phase, Task, Risk, ProjectDocument, Progress
from .serializers import (
    ProjectSerializer, PhaseSerializer, TaskSerializer,
    RiskSerializer, ProjectDocumentSerializer, ProgressSerializer
)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'project_manager']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['start_date', 'end_date', 'created_at']

    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        project = self.get_object()
        data = {
            'progress': project.progress_updates.order_by('-date').first(),
            'risks': project.risks.filter(status='open').count(),
            'tasks': {
                'total': project.phases.all().count(),
                'completed': project.phases.filter(completion_percentage=100).count()
            },
            'budget': {
                'total': project.budget,
                'spent': sum(expense.amount for expense in project.expenses.all())
            }
        }
        return Response(data)

class PhaseViewSet(viewsets.ModelViewSet):
    queryset = Phase.objects.all()
    serializer_class = PhaseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project']

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['phase', 'priority', 'assigned_to']
    search_fields = ['name', 'description']
    ordering_fields = ['start_date', 'end_date', 'priority']

    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        tasks = self.queryset.filter(assigned_to=request.user)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

class RiskViewSet(viewsets.ModelViewSet):
    queryset = Risk.objects.all()
    serializer_class = RiskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['project', 'severity', 'status']
    search_fields = ['title', 'description']

class ProjectDocumentViewSet(viewsets.ModelViewSet):
    queryset = ProjectDocument.objects.all()
    serializer_class = ProjectDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['project', 'document_type']
    search_fields = ['title', 'description']

class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['project']
    ordering_fields = ['date']
