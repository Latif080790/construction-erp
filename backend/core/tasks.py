from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime, timedelta
from apps.projects.models import Project, Task
from apps.finance.models import Invoice, Budget
from apps.resources.models import Equipment

@shared_task
def send_task_reminder_emails():
    """Send reminder emails for tasks due soon"""
    tomorrow = datetime.now().date() + timedelta(days=1)
    tasks = Task.objects.filter(end_date=tomorrow, completion_percentage__lt=100)
    
    for task in tasks:
        if task.assigned_to and task.assigned_to.email:
            send_mail(
                subject=f'Task Due Tomorrow: {task.name}',
                message=f'''
                Task: {task.name}
                Project: {task.phase.project.name}
                Due Date: {task.end_date}
                Current Progress: {task.completion_percentage}%
                
                Please ensure this task is completed by the due date.
                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[task.assigned_to.email],
            )

@shared_task
def send_invoice_reminders():
    """Send reminder emails for overdue invoices"""
    overdue_invoices = Invoice.objects.filter(
        status='sent',
        due_date__lt=datetime.now().date()
    )
    
    for invoice in overdue_invoices:
        project = invoice.project
        if project.project_manager and project.project_manager.email:
            send_mail(
                subject=f'Overdue Invoice: {invoice.invoice_number}',
                message=f'''
                Invoice: {invoice.invoice_number}
                Project: {project.name}
                Amount: {invoice.amount}
                Due Date: {invoice.due_date}
                Days Overdue: {(datetime.now().date() - invoice.due_date).days}
                
                Please follow up on this overdue invoice.
                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[project.project_manager.email],
            )

@shared_task
def generate_project_reports():
    """Generate daily project status reports"""
    active_projects = Project.objects.filter(status='in_progress')
    
    for project in active_projects:
        # Calculate project metrics
        total_tasks = project.phases.all().count()
        completed_tasks = project.phases.filter(completion_percentage=100).count()
        
        budget = Budget.objects.filter(project=project).first()
        if budget:
            budget_usage = sum(expense.amount for expense in project.expenses.all()) / budget.total_amount
        else:
            budget_usage = 0
        
        # Send report to project manager
        if project.project_manager and project.project_manager.email:
            send_mail(
                subject=f'Daily Project Report: {project.name}',
                message=f'''
                Project: {project.name}
                Date: {datetime.now().date()}
                
                Progress Summary:
                - Tasks Completed: {completed_tasks}/{total_tasks}
                - Budget Usage: {budget_usage:.2%}
                - Active Risks: {project.risks.filter(status='open').count()}
                
                Recent Updates:
                {project.progress_updates.order_by('-date').first().description if project.progress_updates.exists() else 'No recent updates'}
                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[project.project_manager.email],
            )

@shared_task
def check_equipment_maintenance():
    """Check and notify about equipment maintenance schedules"""
    tomorrow = datetime.now().date() + timedelta(days=1)
    equipment_due = Equipment.objects.filter(next_maintenance_date=tomorrow)
    
    for equipment in equipment_due:
        # Get all project managers who have this equipment assigned
        project_managers = set(
            assignment.project.project_manager
            for assignment in equipment.assignments.filter(return_date__isnull=True)
            if assignment.project.project_manager
        )
        
        # Send notifications
        for manager in project_managers:
            if manager.email:
                send_mail(
                    subject=f'Equipment Maintenance Due: {equipment.name}',
                    message=f'''
                    Equipment: {equipment.name} ({equipment.equipment_code})
                    Maintenance Due Date: {equipment.next_maintenance_date}
                    Current Location: {equipment.location}
                    
                    Please arrange for this equipment to be serviced.
                    ''',
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[manager.email],
                )
