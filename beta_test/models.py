from django.contrib import admin
from django.db import models



class BetaTestAllowedUsers(models.Model):
    email = models.EmailField(max_length=254)
    
    
    def __unicode__(self):
      return u'%s' % (self.email)
    
    
admin.site.register(BetaTestAllowedUsers)