import pytest
from datetime import datetime, timedelta
from decimal import Decimal
from django.utils import timezone
from apps.projects.models import Project, Task
from apps.resources.models import Resource, ResourceAllocation
from apps.finance.models import Budget, Transaction
from apps.quality.models import QualityCheck
from apps.safety.models import SafetyIncident

@pytest.mark.django_db
class TestConstructionScenarios:
    @pytest.fixture
    def project_setup(self):
        """Set up a basic project with resources and budget"""
        project = Project.objects.create(
            name="Test Construction Project",
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(days=180),
            budget_amount=Decimal("1000000.00")
        )
        
        # Create tasks
        tasks = [
            Task.objects.create(
                project=project,
                name=f"Phase {i}",
                start_date=project.start_date + timedelta(days=i*30),
                end_date=project.start_date + timedelta(days=(i+1)*30),
                progress=0
            ) for i in range(6)
        ]
        
        # Create resources
        resources = {
            "LABOR": Resource.objects.create(
                type="LABOR",
                name="Construction Workers",
                capacity=100
            ),
            "EQUIPMENT": Resource.objects.create(
                type="EQUIPMENT",
                name="Excavator",
                capacity=1
            ),
            "MATERIAL": Resource.objects.create(
                type="MATERIAL",
                name="Concrete",
                capacity=1000
            )
        }
        
        return {
            "project": project,
            "tasks": tasks,
            "resources": resources
        }

    def test_project_timeline_management(self, project_setup):
        """Test project timeline management and dependencies"""
        project = project_setup["project"]
        tasks = project_setup["tasks"]
        
        # Update task progress
        tasks[0].progress = 100
        tasks[0].save()
        
        # Verify project progress calculation
        project.refresh_from_db()
        assert project.calculate_progress() == pytest.approx(16.67, rel=1e-2)
        
        # Test task dependency
        tasks[1].dependencies.add(tasks[0])
        assert tasks[1].can_start() == True
        
        # Test schedule impact
        tasks[1].start_date += timedelta(days=5)
        tasks[1].save()
        assert project.has_schedule_impact() == True

    def test_resource_allocation(self, project_setup):
        """Test resource allocation and conflicts"""
        project = project_setup["project"]
        tasks = project_setup["tasks"]
        resources = project_setup["resources"]
        
        # Allocate resources to tasks
        allocation = ResourceAllocation.objects.create(
            resource=resources["LABOR"],
            task=tasks[0],
            quantity=50
        )
        
        # Test resource availability
        assert resources["LABOR"].get_available_capacity(
            tasks[0].start_date,
            tasks[0].end_date
        ) == 50
        
        # Test over-allocation
        with pytest.raises(ValueError):
            ResourceAllocation.objects.create(
                resource=resources["LABOR"],
                task=tasks[0],
                quantity=60
            )

    def test_budget_tracking(self, project_setup):
        """Test budget allocation and tracking"""
        project = project_setup["project"]
        
        # Create budget categories
        labor_budget = Budget.objects.create(
            project=project,
            category="LABOR",
            amount=Decimal("400000.00")
        )
        
        # Record transactions
        transaction = Transaction.objects.create(
            project=project,
            budget=labor_budget,
            amount=Decimal("50000.00"),
            transaction_type="EXPENSE"
        )
        
        # Test budget utilization
        assert labor_budget.get_utilization() == pytest.approx(12.5, rel=1e-2)
        
        # Test budget alerts
        assert not labor_budget.is_over_budget()
        
        # Add more transactions to test over-budget
        Transaction.objects.create(
            project=project,
            budget=labor_budget,
            amount=Decimal("370000.00"),
            transaction_type="EXPENSE"
        )
        
        assert labor_budget.is_over_budget()

    def test_quality_control(self, project_setup):
        """Test quality control processes"""
        project = project_setup["project"]
        tasks = project_setup["tasks"]
        
        # Create quality check
        quality_check = QualityCheck.objects.create(
            project=project,
            task=tasks[0],
            check_type="INSPECTION",
            status="PENDING"
        )
        
        # Test quality check workflow
        quality_check.perform_check(
            inspector="John Doe",
            result="PASS",
            notes="Meets specifications"
        )
        
        assert quality_check.status == "COMPLETED"
        assert tasks[0].has_passed_quality_check() == True
        
        # Test failed quality check
        failed_check = QualityCheck.objects.create(
            project=project,
            task=tasks[1],
            check_type="INSPECTION",
            status="PENDING"
        )
        
        failed_check.perform_check(
            inspector="Jane Doe",
            result="FAIL",
            notes="Does not meet specifications"
        )
        
        assert tasks[1].requires_rework() == True

    def test_safety_incident_management(self, project_setup):
        """Test safety incident reporting and management"""
        project = project_setup["project"]
        
        # Report safety incident
        incident = SafetyIncident.objects.create(
            project=project,
            incident_type="NEAR_MISS",
            severity="LOW",
            description="Worker slipped but caught balance"
        )
        
        # Test incident reporting
        assert project.get_incident_count() == 1
        
        # Test safety metrics
        assert project.calculate_incident_rate() > 0
        
        # Test incident resolution
        incident.resolve(
            resolution="Additional non-slip mats installed",
            resolved_by="Safety Officer"
        )
        
        assert incident.status == "RESOLVED"
        
        # Test preventive measures
        assert project.has_pending_safety_actions() == True
