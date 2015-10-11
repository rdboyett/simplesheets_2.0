import datetime

from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe, SafeData, mark_for_escaping


register = template.Library()



@register.filter
def subtractSlash(mathAnswer):
    try:
        return mathAnswer.replace('\\\\', '\\')
    except:
        return mathAnswer
    
    
    
    