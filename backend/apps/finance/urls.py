from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'budgets', views.BudgetViewSet)
router.register(r'budget-items', views.BudgetItemViewSet)
router.register(r'expenses', views.ExpenseViewSet)
router.register(r'invoices', views.InvoiceViewSet)
router.register(r'payments', views.PaymentViewSet)
router.register(r'cost-codes', views.CostCodeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
