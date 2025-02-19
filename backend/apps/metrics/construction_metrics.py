from prometheus_client import Gauge, Counter, Histogram
from django.db import models
from datetime import datetime, timedelta

# Project Metrics
project_schedule_variance = Gauge(
    'project_schedule_variance_days',
    'Schedule variance in days by project',
    ['project_id', 'project_name']
)

project_cost_variance = Gauge(
    'project_cost_variance_percentage',
    'Cost variance as percentage by project',
    ['project_id', 'project_name']
)

material_utilization = Gauge(
    'material_utilization_percentage',
    'Material utilization rate by type',
    ['material_type', 'project_id']
)

equipment_utilization = Gauge(
    'equipment_utilization_hours',
    'Equipment utilization in hours',
    ['equipment_type', 'project_id']
)

labor_productivity = Gauge(
    'labor_productivity_rate',
    'Labor productivity rate by trade',
    ['trade_type', 'project_id']
)

# Safety Metrics
safety_incident_counter = Counter(
    'safety_incidents_total',
    'Number of safety incidents by type and severity',
    ['incident_type', 'severity', 'project_id']
)

near_miss_counter = Counter(
    'near_miss_incidents_total',
    'Number of near-miss incidents',
    ['category', 'project_id']
)

safety_training_hours = Counter(
    'safety_training_hours_total',
    'Total safety training hours',
    ['training_type', 'project_id']
)

# Quality Metrics
quality_defects = Counter(
    'quality_defects_total',
    'Number of quality defects by type',
    ['defect_type', 'severity', 'project_id']
)

rework_hours = Counter(
    'rework_hours_total',
    'Total hours spent on rework',
    ['cause', 'trade', 'project_id']
)

inspection_results = Gauge(
    'inspection_score',
    'Inspection scores by type',
    ['inspection_type', 'project_id']
)

# Resource Metrics
material_wastage = Gauge(
    'material_wastage_percentage',
    'Material wastage as percentage',
    ['material_type', 'project_id']
)

equipment_downtime = Counter(
    'equipment_downtime_hours',
    'Equipment downtime in hours',
    ['equipment_type', 'cause', 'project_id']
)

labor_attendance = Gauge(
    'labor_attendance_percentage',
    'Labor attendance rate',
    ['trade_type', 'project_id']
)

# Environmental Metrics
carbon_emissions = Counter(
    'carbon_emissions_kg',
    'Carbon emissions in kg',
    ['source_type', 'project_id']
)

water_usage = Counter(
    'water_usage_liters',
    'Water usage in liters',
    ['usage_type', 'project_id']
)

waste_generated = Counter(
    'waste_generated_kg',
    'Waste generated in kg',
    ['waste_type', 'project_id']
)

# Financial Metrics
cash_flow = Gauge(
    'cash_flow_amount',
    'Cash flow amount',
    ['flow_type', 'project_id']
)

payment_delay = Gauge(
    'payment_delay_days',
    'Payment delay in days',
    ['payment_type', 'project_id']
)

budget_burndown = Gauge(
    'budget_burndown_rate',
    'Budget burndown rate',
    ['cost_category', 'project_id']
)

# Weather Impact Metrics
weather_delay_hours = Counter(
    'weather_delay_hours',
    'Hours of delay due to weather',
    ['weather_type', 'project_id']
)

class MetricsCollector:
    @staticmethod
    def collect_project_metrics(project_id):
        """Collect and update all project-related metrics"""
        project = Project.objects.get(id=project_id)
        
        # Schedule metrics
        planned_progress = project.get_planned_progress()
        actual_progress = project.get_actual_progress()
        schedule_variance = (actual_progress - planned_progress).days
        project_schedule_variance.labels(
            project_id=project_id,
            project_name=project.name
        ).set(schedule_variance)
        
        # Cost metrics
        planned_cost = project.get_planned_cost()
        actual_cost = project.get_actual_cost()
        cost_variance = ((actual_cost - planned_cost) / planned_cost) * 100
        project_cost_variance.labels(
            project_id=project_id,
            project_name=project.name
        ).set(cost_variance)

    @staticmethod
    def collect_safety_metrics(project_id):
        """Collect and update all safety-related metrics"""
        today = datetime.now()
        thirty_days_ago = today - timedelta(days=30)
        
        incidents = SafetyIncident.objects.filter(
            project_id=project_id,
            date__gte=thirty_days_ago
        )
        
        for incident in incidents:
            safety_incident_counter.labels(
                incident_type=incident.type,
                severity=incident.severity,
                project_id=project_id
            ).inc()

    @staticmethod
    def collect_quality_metrics(project_id):
        """Collect and update all quality-related metrics"""
        inspections = QualityInspection.objects.filter(project_id=project_id)
        
        for inspection in inspections:
            inspection_results.labels(
                inspection_type=inspection.type,
                project_id=project_id
            ).set(inspection.score)

    @staticmethod
    def collect_resource_metrics(project_id):
        """Collect and update all resource-related metrics"""
        resources = ResourceUtilization.objects.filter(project_id=project_id)
        
        for resource in resources:
            if resource.type == 'MATERIAL':
                material_utilization.labels(
                    material_type=resource.material_type,
                    project_id=project_id
                ).set(resource.utilization_rate)
            elif resource.type == 'EQUIPMENT':
                equipment_utilization.labels(
                    equipment_type=resource.equipment_type,
                    project_id=project_id
                ).set(resource.hours_used)
