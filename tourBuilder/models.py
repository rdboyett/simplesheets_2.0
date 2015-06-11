from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User


class MyTour(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=45)
    nManditoryRuns = models.IntegerField()
    nTimesRan = models.IntegerField(blank=True, null=True)



    def __unicode__(self):
          return u'%s - %s %s' % (self.name, self.user.first_name, self.user.last_name)
      
    class Meta:
        ordering = ['user__last_name', 'name']




admin.site.register(MyTour)