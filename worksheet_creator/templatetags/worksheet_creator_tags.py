import datetime

from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe, SafeData, mark_for_escaping


register = template.Library()

from worksheet_creator.settings import DOMAIN



@register.filter
def subtractSlash(mathAnswer):
    try:
        return mathAnswer.replace('\\\\', '\\')
    except:
        return mathAnswer
    
    
    
@register.assignment_tag(takes_context=False)
def is_ducksoup():
    if DOMAIN == 'ducksoup.us':
        return "yes"
    else:
        return ""
    