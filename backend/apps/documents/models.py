from django.db import models
from django.contrib.auth.models import User
from apps.projects.models import Project

class Document(models.Model):
    DOCUMENT_TYPES = [
        ('contract', 'Contract'),
        ('drawing', 'Drawing'),
        ('specification', 'Specification'),
        ('permit', 'Permit'),
        ('report', 'Report'),
        ('correspondence', 'Correspondence'),
        ('other', 'Other'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='all_documents')
    title = models.CharField(max_length=200)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    document_number = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    file = models.FileField(upload_to='documents/')
    version = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_documents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.document_number} - {self.title}"

class DocumentVersion(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    version_number = models.CharField(max_length=20)
    file = models.FileField(upload_to='document_versions/')
    changes = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.document.document_number} - v{self.version_number}"

class Drawing(models.Model):
    DRAWING_TYPES = [
        ('architectural', 'Architectural'),
        ('structural', 'Structural'),
        ('mechanical', 'Mechanical'),
        ('electrical', 'Electrical'),
        ('plumbing', 'Plumbing'),
        ('civil', 'Civil'),
        ('other', 'Other'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='drawings')
    drawing_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    drawing_type = models.CharField(max_length=20, choices=DRAWING_TYPES)
    scale = models.CharField(max_length=20)
    revision = models.CharField(max_length=10)
    file = models.FileField(upload_to='drawings/')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.drawing_number} - {self.title}"

class DrawingRevision(models.Model):
    drawing = models.ForeignKey(Drawing, on_delete=models.CASCADE, related_name='revisions')
    revision_number = models.CharField(max_length=10)
    file = models.FileField(upload_to='drawing_revisions/')
    changes = models.TextField()
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='approved_revisions')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_revisions')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.drawing.drawing_number} - Rev{self.revision_number}"

class Contract(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('review', 'Under Review'),
        ('approved', 'Approved'),
        ('signed', 'Signed'),
        ('expired', 'Expired'),
        ('terminated', 'Terminated'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='contracts')
    contract_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    party_name = models.CharField(max_length=200)
    party_address = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    value = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    file = models.FileField(upload_to='contracts/')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.contract_number} - {self.title}"

class Submittal(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('reviewed', 'Reviewed'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('revised', 'Revised'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='submittals')
    submittal_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    submission_date = models.DateField()
    required_return_date = models.DateField()
    actual_return_date = models.DateField(null=True, blank=True)
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='submitted_submittals')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reviewed_submittals')
    
    def __str__(self):
        return f"{self.submittal_number} - {self.title}"

class SubmittalItem(models.Model):
    submittal = models.ForeignKey(Submittal, on_delete=models.CASCADE, related_name='items')
    document = models.ForeignKey(Document, on_delete=models.SET_NULL, null=True)
    drawing = models.ForeignKey(Drawing, on_delete=models.SET_NULL, null=True)
    description = models.TextField()
    remarks = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.submittal.submittal_number} - Item {self.id}"
