import datetime

from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe, SafeData, mark_for_escaping


register = template.Library()



@register.filter
def googleDate(dateTime):
    newDate = datetime.datetime.strptime(dateTime.split('T')[0], '%Y-%m-%d')
    return newDate
    
    
    
    
    
    
    
    
    