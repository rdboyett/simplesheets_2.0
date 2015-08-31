from django.contrib import admin
from payment_tracker.models import PaymentUser


class PaymentUserAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_Name', 'payer_email', 'bFreeUser')
    list_filter = ['user__first_name']
    search_fields = ['payer_email']

admin.site.register(PaymentUser, PaymentUserAdmin)