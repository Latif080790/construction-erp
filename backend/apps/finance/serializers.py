from rest_framework import serializers
from .models import Budget, BudgetItem, Expense, Invoice, Payment, CostCode

class BudgetItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetItem
        fields = '__all__'

class BudgetSerializer(serializers.ModelSerializer):
    items = BudgetItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    payments = PaymentSerializer(many=True, read_only=True)
    remaining_amount = serializers.SerializerMethodField()
    
    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ('created_at',)
    
    def get_remaining_amount(self, obj):
        total_payments = sum(payment.amount for payment in obj.payments.all())
        return obj.amount - total_payments

class CostCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostCode
        fields = '__all__'
