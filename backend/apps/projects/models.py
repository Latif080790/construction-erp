from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal

class Project(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('in_progress', 'In Progress'),
        ('on_hold', 'On Hold'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    location = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    budget = models.DecimalField(max_digits=15, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    project_manager = models.ForeignKey(User, on_delete=models.PROTECT, related_name='managed_projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Phase(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='phases')
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    completion_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    def __str__(self):
        return f"{self.project.code} - {self.name}"

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    phase = models.ForeignKey(Phase, on_delete=models.CASCADE, related_name='tasks')
    name = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_tasks')
    completion_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    dependencies = models.ManyToManyField('self', symmetrical=False, blank=True)
    
    def __str__(self):
        return f"{self.phase.project.code} - {self.name}"

class Risk(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='risks')
    title = models.CharField(max_length=200)
    description = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    probability = models.DecimalField(max_digits=5, decimal_places=2)
    impact = models.TextField()
    mitigation_plan = models.TextField()
    identified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    identified_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, default='open')
    
    def __str__(self):
        return f"{self.project.code} - {self.title}"

class ProjectDocument(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=200)
    document_type = models.CharField(max_length=50)
    file = models.FileField(upload_to='project_documents/')
    version = models.CharField(max_length=20)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.project.code} - {self.title} (v{self.version})"

class Progress(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='progress_updates')
    date = models.DateField()
    description = models.TextField()
    percentage_complete = models.DecimalField(max_digits=5, decimal_places=2)
    reported_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    attachments = models.ManyToManyField(ProjectDocument, blank=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.project.code} - Progress Update ({self.date})"
