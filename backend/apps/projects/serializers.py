from rest_framework import serializers
from .models import Project, Phase, Task, Risk, ProjectDocument, Progress

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class PhaseSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    
    class Meta:
        model = Phase
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class RiskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Risk
        fields = '__all__'
        read_only_fields = ('identified_date',)

class ProjectDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDocument
        fields = '__all__'
        read_only_fields = ('upload_date',)

class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    phases = PhaseSerializer(many=True, read_only=True)
    risks = RiskSerializer(many=True, read_only=True)
    documents = ProjectDocumentSerializer(many=True, read_only=True)
    progress_updates = ProgressSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
