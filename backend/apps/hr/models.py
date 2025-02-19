from django.db import models
from django.contrib.auth.models import User
from apps.projects.models import Project

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    emergency_contact = models.CharField(max_length=100)
    emergency_phone = models.CharField(max_length=20)
    join_date = models.DateField()
    termination_date = models.DateField(null=True, blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.employee_id} - {self.user.get_full_name()}"

class Attendance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    time_in = models.TimeField()
    time_out = models.TimeField(null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='attendance_records')
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.date}"

class TimeSheet(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='timesheets')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='timesheets')
    start_date = models.DateField()
    end_date = models.DateField()
    total_hours = models.DecimalField(max_digits=6, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    submitted_date = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='approved_timesheets')
    approved_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.start_date} to {self.end_date}"

class TimeSheetEntry(models.Model):
    timesheet = models.ForeignKey(TimeSheet, on_delete=models.CASCADE, related_name='entries')
    date = models.DateField()
    hours_worked = models.DecimalField(max_digits=4, decimal_places=2)
    description = models.TextField()
    
    def __str__(self):
        return f"{self.timesheet.employee.employee_id} - {self.date}"

class Leave(models.Model):
    LEAVE_TYPES = [
        ('annual', 'Annual Leave'),
        ('sick', 'Sick Leave'),
        ('personal', 'Personal Leave'),
        ('unpaid', 'Unpaid Leave'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]
    
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leaves')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='approved_leaves')
    approved_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.leave_type} ({self.start_date} to {self.end_date})"

class Performance(models.Model):
    RATING_CHOICES = [
        (1, 'Poor'),
        (2, 'Below Average'),
        (3, 'Average'),
        (4, 'Above Average'),
        (5, 'Excellent'),
    ]
    
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='performance_reviews')
    review_date = models.DateField()
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True)
    rating = models.IntegerField(choices=RATING_CHOICES)
    strengths = models.TextField()
    areas_for_improvement = models.TextField()
    goals = models.TextField()
    comments = models.TextField()
    
    def __str__(self):
        return f"{self.employee.employee_id} - Review {self.review_date}"

class Training(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    trainer = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    max_participants = models.IntegerField()
    
    def __str__(self):
        return f"{self.title} ({self.start_date} to {self.end_date})"

class TrainingParticipant(models.Model):
    training = models.ForeignKey(Training, on_delete=models.CASCADE, related_name='participants')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='trainings')
    status = models.CharField(max_length=20, default='registered')
    completion_date = models.DateField(null=True, blank=True)
    certificate_number = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.training.title}"
