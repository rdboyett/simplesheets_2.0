import os
ROOT_PATH = os.path.dirname(__file__)

import json
import logging

from datetime import datetime, timedelta, tzinfo
from pytz import timezone
import pytz


ZERO = timedelta(0)

class UTC(tzinfo):
  def utcoffset(self, dt):
    return ZERO
  def tzname(self, dt):
    return "UTC"
  def dst(self, dt):
    return ZERO

utc = UTC()



from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from email.MIMEImage import MIMEImage

from django.shortcuts import render_to_response, redirect
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required




@login_required
def contact(request):
    if request.method == 'POST':
        message = request.POST['message'].strip()
        
        central = timezone('US/Central')
        myUtc = datetime.now(utc)
        local = myUtc.astimezone(central)
        localTime = local.strftime("%I:%M %p")
	args = {
            "user":request.user,
	    "message":message,
            "date":local,
            "time":localTime,
	}
	    
	#Send email confirmation
	subject = request.user.email+" ducksoup help-request"
	sender = "Ducksoup Inc. <webmaster@ducksoup.us>"

	html_content = render_to_string('contact_me/help_request.html', args)
	text_content = render_to_string('contact_me/help_request.txt', args)
	msg = EmailMultiAlternatives(subject, text_content,
					 sender, ['support@ducksoup.us'])
	
	msg.attach_alternative(html_content, "text/html")
	    
	msg.send()
	    
        data = {'success':'success'}
	
    else:
        data = {'error':'Did not post correctly'}
    return HttpResponse(json.dumps(data))








