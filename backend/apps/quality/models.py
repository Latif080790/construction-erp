from django.db import models
from django.contrib.auth.models import User
from apps.projects.models import Project, Task

class QualityStandard(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    reference_document = models.FileField(upload_to='quality_standards/', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.code} - {self.name}"

class Inspection(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    RESULT_CHOICES = [
        ('pass', 'Pass'),
        ('fail', 'Fail'),
        ('conditional', 'Conditional Pass'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='inspections')
    inspection_number = models.CharField(max_length=50, unique=True)
    task = models.ForeignKey(Task, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    scheduled_date = models.DateField()
    actual_date = models.DateField(null=True, blank=True)
    inspector = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='conducted_inspections')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    result = models.CharField(max_length=20, choices=RESULT_CHOICES, null=True, blank=True)
    remarks = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.inspection_number} - {self.title}"

class InspectionItem(models.Model):
    inspection = models.ForeignKey(Inspection, on_delete=models.CASCADE, related_name='items')
    standard = models.ForeignKey(QualityStandard, on_delete=models.SET_NULL, null=True)
    description = models.TextField()
    requirement = models.TextField()
    actual_condition = models.TextField()
    is_compliant = models.BooleanField(default=False)
    remarks = models.TextField(blank=True)
    photos = models.ManyToManyField('InspectionPhoto', blank=True)
    
    def __str__(self):
        return f"{self.inspection.inspection_number} - Item {self.id}"

class InspectionPhoto(models.Model):
    photo = models.ImageField(upload_to='inspection_photos/')
    caption = models.CharField(max_length=200)
    taken_at = models.DateTimeField()
    taken_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return f"Photo {self.id} - {self.caption}"

class NonConformanceReport(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('under_review', 'Under Review'),
        ('corrective_action', 'Corrective Action'),
        ('closed', 'Closed'),
    ]
    
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='ncrs')
    ncr_number = models.CharField(max_length=50, unique=True)
    inspection = models.ForeignKey(Inspection, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    identified_date = models.DateField()
    identified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='identified_ncrs')
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    root_cause = models.TextField()
    corrective_action = models.TextField()
    preventive_action = models.TextField()
    due_date = models.DateField()
    closed_date = models.DateField(null=True, blank=True)
    closed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='closed_ncrs')
    
    def __str__(self):
        return f"{self.ncr_number} - {self.title}"

class QualityChecklist(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='quality_checklists')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.project.code} - {self.title}"

class ChecklistItem(models.Model):
    checklist = models.ForeignKey(QualityChecklist, on_delete=models.CASCADE, related_name='items')
    description = models.TextField()
    requirement = models.TextField()
    standard = models.ForeignKey(QualityStandard, on_delete=models.SET_NULL, null=True)
    order = models.IntegerField()
    
    def __str__(self):
        return f"{self.checklist.title} - Item {self.order}"

class QualityAudit(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='quality_audits')
    audit_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    scheduled_date = models.DateField()
    actual_date = models.DateField(null=True, blank=True)
    auditor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='conducted_audits')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    findings = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.audit_number} - {self.title}"
