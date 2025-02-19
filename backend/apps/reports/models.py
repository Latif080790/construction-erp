from django.db import models
from django.contrib.auth.models import User
from apps.projects.models import Project

class Report(models.Model):
    REPORT_TYPES = [
        ('daily', 'Daily Progress Report'),
        ('weekly', 'Weekly Progress Report'),
        ('monthly', 'Monthly Progress Report'),
        ('financial', 'Financial Report'),
        ('quality', 'Quality Report'),
        ('safety', 'Safety Report'),
        ('resource', 'Resource Utilization Report'),
        ('custom', 'Custom Report'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='reports')
    report_number = models.CharField(max_length=50, unique=True)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    period_start = models.DateField()
    period_end = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_reports')
    created_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='approved_reports')
    approved_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.report_number} - {self.title}"

class ReportSection(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='sections')
    title = models.CharField(max_length=200)
    content = models.TextField()
    order = models.IntegerField()
    
    def __str__(self):
        return f"{self.report.report_number} - {self.title}"

class ReportAttachment(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='attachments')
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='report_attachments/')
    description = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.report.report_number} - {self.title}"

class Dashboard(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='dashboards')
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.project.code} - {self.title}"

class DashboardWidget(models.Model):
    WIDGET_TYPES = [
        ('chart', 'Chart'),
        ('table', 'Table'),
        ('metric', 'Metric'),
        ('timeline', 'Timeline'),
        ('custom', 'Custom'),
    ]
    
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE, related_name='widgets')
    title = models.CharField(max_length=200)
    widget_type = models.CharField(max_length=20, choices=WIDGET_TYPES)
    data_source = models.CharField(max_length=200)
    configuration = models.JSONField()
    refresh_interval = models.IntegerField(default=3600)  # in seconds
    order = models.IntegerField()
    
    def __str__(self):
        return f"{self.dashboard.title} - {self.title}"

class ScheduledReport(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='scheduled_reports')
    report_type = models.CharField(max_length=20, choices=Report.REPORT_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    recipients = models.ManyToManyField(User, related_name='subscribed_reports')
    is_active = models.BooleanField(default=True)
    last_generated = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.project.code} - {self.title}"

class ReportTemplate(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    report_type = models.CharField(max_length=20, choices=Report.REPORT_TYPES)
    template_file = models.FileField(upload_to='report_templates/')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - {self.report_type}"
