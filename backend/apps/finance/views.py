from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum
from .models import Budget, BudgetItem, Expense, Invoice, Payment, CostCode
from .serializers import (
    BudgetSerializer, BudgetItemSerializer, ExpenseSerializer,
    InvoiceSerializer, PaymentSerializer, CostCodeSerializer
)

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project']

    @action(detail=True, methods=['get'])
    def analysis(self, request, pk=None):
        budget = self.get_object()
        expenses = Expense.objects.filter(project=budget.project)
        
        data = {
            'total_budget': budget.total_amount,
            'total_expenses': expenses.aggregate(total=Sum('amount'))['total'] or 0,
            'by_category': {}
        }
        
        for category, _ in BudgetItem.CATEGORY_CHOICES:
            budget_amount = budget.items.filter(category=category).aggregate(
                total=Sum('total_price'))['total'] or 0
            actual_amount = expenses.filter(budget_item__category=category).aggregate(
                total=Sum('amount'))['total'] or 0
            
            data['by_category'][category] = {
                'budget': budget_amount,
                'actual': actual_amount,
                'variance': budget_amount - actual_amount
            }
        
        return Response(data)

class BudgetItemViewSet(viewsets.ModelViewSet):
    queryset = BudgetItem.objects.all()
    serializer_class = BudgetItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['budget', 'category']

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project', 'status', 'submitted_by']
    search_fields = ['description']
    ordering_fields = ['date', 'amount']

    @action(detail=False, methods=['get'])
    def my_expenses(self, request):
        expenses = self.queryset.filter(submitted_by=request.user)
        serializer = self.get_serializer(expenses, many=True)
        return Response(serializer.data)

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project', 'status']
    search_fields = ['invoice_number', 'notes']
    ordering_fields = ['date', 'due_date', 'amount']

    @action(detail=True, methods=['get'])
    def payment_history(self, request, pk=None):
        invoice = self.get_object()
        payments = invoice.payments.all().order_by('payment_date')
        return Response({
            'total_amount': invoice.amount,
            'paid_amount': sum(payment.amount for payment in payments),
            'payments': PaymentSerializer(payments, many=True).data
        })

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['invoice', 'payment_method']
    ordering_fields = ['payment_date', 'amount']

class CostCodeViewSet(viewsets.ModelViewSet):
    queryset = CostCode.objects.all()
    serializer_class = CostCodeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['code', 'description']

    def get_queryset(self):
        queryset = CostCode.objects.all()
        parent = self.request.query_params.get('parent', None)
        if parent is not None:
            queryset = queryset.filter(parent_id=parent)
        return queryset
