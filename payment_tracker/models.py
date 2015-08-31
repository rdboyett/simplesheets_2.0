import datetime

from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User

from paypal.standard.ipn.models import PayPalIPN


class PaymentUser(models.Model):
    user = models.ForeignKey(User)
    payments = models.ManyToManyField(PayPalIPN, blank=True, null=True)
    creationDate = models.DateTimeField(auto_now_add=True)
    numberOfProjects = models.IntegerField(default=0)
    bFreeUser = models.BooleanField(default=False)
    paymentType = models.CharField(max_length=65, blank=True, null=True)
    bPaidUp = models.BooleanField(default=False)
    lastPaymentDate = models.DateTimeField(blank=True, null=True)
    nextPaymentDate = models.DateTimeField(blank=True, null=True)
    payer_email = models.EmailField(max_length=65, blank=True, null=True)
    payer_id = models.CharField(max_length=100, blank=True, null=True)
    lastProjectDate = models.DateTimeField(blank=True, null=True)
    

    def __unicode__(self):
      return u'%s %s' % (self.user.first_name, self.user.last_name)
    
    def user_Email(self):
        return self.user.email
    def user_Name(self):
        return u'%s %s' % (self.user.first_name, self.user.last_name)
    
    
#admin.site.register(PaymentUser)