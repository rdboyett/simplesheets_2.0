import os
ROOT_PATH = os.path.dirname(__file__)

import json
import logging
import httplib2
from datetime import datetime, timedelta

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from email.MIMEImage import MIMEImage

from django.shortcuts import render_to_response, redirect
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.utils import timezone

from google_login.models import CredentialsModel, GoogleUserInfo, ForgottenPassword, EmailAccountCreation
from userInfo_profile.models import UserInfo
from classrooms.models import Classroom, ClassUser
from google_login import settings
from forms import ContactForm
from beta_test.models import BetaTestAllowedUsers

from apiclient.discovery import build
from oauth2client import xsrfutil
from oauth2client.client import flow_from_clientsecrets
from oauth2client.django_orm import Storage

from oauth2client.client import OAuth2WebServerFlow

from apiclient import errors

bBETA_TEST_ON = settings.BETA_TEST_ON

# CLIENT_SECRETS, name of a file containing the OAuth 2.0 information for this
# application, including client_id and client_secret, which are found
# on the API Access tab on the Google APIs
# Console <http://code.google.com/apis/console>
CLIENT_SECRETS = settings.CLIENT_SECRETS

SCOPES = settings.SCOPES

FLOW = flow_from_clientsecrets(
    CLIENT_SECRETS,
    scope= ' '.join(SCOPES),
    redirect_uri= settings.redirect_uri)



import logging
log = logging.getLogger(__name__)


def index(request):
    if 'user_id' in request.session:
        user_id = request.session['user_id']
        if User.objects.filter(id=user_id):
            user = User.objects.get(id=user_id)
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)
	    request.session.set_expiry(604800)  #Time is in Seconds, this equals 7 days
            return HttpResponseRedirect(settings.LOGIN_SUCCESS)
        
        else:
            user_id = False
    else:
        user_id = False
    
    if not user_id:
        args = {}
        args.update(csrf(request))
        #redirect to user login page
        return render_to_response('google_login/login.html', args)

    
def auth(request):
    request.session['popup'] = True
    request.session.set_expiry(300)
    
    credential = None
        
    if credential is None or credential.invalid == True:
        FLOW.params['access_type'] = 'offline'
        FLOW.params['approval_prompt'] = 'force'
        FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY,
                                                        request.user)
        authorize_url = FLOW.step1_get_authorize_url()
        return HttpResponseRedirect(authorize_url)



def noPopAuth(request):
    request.session['popup'] = False
    request.session.set_expiry(300)
    
    credential = None
        
    if credential is None or credential.invalid == True:
        FLOW.params['access_type'] = 'offline'
        FLOW.params['approval_prompt'] = 'force'
        FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY,
                                                        request.user)
        authorize_url = FLOW.step1_get_authorize_url()
        return HttpResponseRedirect(authorize_url)



def auth_return(request):
    if not xsrfutil.validate_token(settings.SECRET_KEY, request.REQUEST['state'],
                                   request.user):
      return  HttpResponseBadRequest()
    credential = FLOW.step2_exchange(request.REQUEST)

    user_info = get_user_info(credential)
    google_email = user_info.get('email')
    firstName = user_info.get('given_name')
    lastName = user_info.get('family_name')
    google_id = user_info.get('id')
    googlePlus = user_info.get('link')
    language = user_info.get('locale')
    googleAvatar = user_info.get('picture')
    gender = user_info.get('gender')
        
    emailEnding = google_email.split("@")[1]
    userName = "@"+google_email.split("@")[0]+emailEnding[:1]
    
    if bBETA_TEST_ON:
	if not BetaTestAllowedUsers.objects.filter(email=google_email):
	    return redirect("worksheet_project.views.index")
    
    if User.objects.filter(email=google_email):
        user = User.objects.get(email=google_email)
    else:
	#check for duplicate usernames and iterate to unique
	if User.objects.filter(username=userName):
	    countUsernames = User.objects.filter(username=userName).count()
	    userName = userName+str(countUsernames)
        user = User.objects.create(
            username = userName,
            first_name = firstName,
            last_name = lastName,
            email = google_email,
            password = userName+google_id[:5],
        )
	
	UserInfo.objects.create(
	    user = user
	)

    #Update the User model with changes in google
    if not user.first_name:
	user.first_name = firstName
	user.last_name = lastName
	user.save()

    #Check to see if a google account has been setup yet
    if not GoogleUserInfo.objects.filter(google_id=google_id):
        newGoogleUser = GoogleUserInfo.objects.create(
            user = user,
            google_id = google_id,
            googlePlus = googlePlus,
            language = language,
            googleAvatar = googleAvatar,
            gender = gender,
        )
            
    
    #check to see if user is logged in
    if user:
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)
        
    request.session['user_id'] = user.id
    request.session.set_expiry(604800) #Time is in Seconds, this equals 7 days
    storage = Storage(CredentialsModel, 'id', user, 'credential')
    storage.put(credential)
    #return HttpResponseRedirect(settings.LOGIN_SUCCESS)
    #return HttpResponse('<script>window.close();</script>')
    
    if 'popup' in request.session:
        popup = request.session['popup']
    	if popup:
    	    return render_to_response('google_login/login_return.html', {"user":request.user,})
	else:
	    return redirect("worksheet_project.views.dashboard")
    else:
	return render_to_response('google_login/login_return.html', {"user":request.user,})



def get_user_info(credentials):
  """Send a request to the UserInfo API to retrieve the user's information.

  Args:
    credentials: oauth2client.client.OAuth2Credentials instance to authorize the
                 request.
  Returns:
    User information as a dict.
  """
  user_info_service = build(
      serviceName='oauth2', version='v2',
      http=credentials.authorize(httplib2.Http()))
  user_info = None
  try:
    user_info = user_info_service.userinfo().get().execute()
  except errors.HttpError, e:
    logging.error('An error occurred: %s', e)
  if user_info and user_info.get('id'):
    return user_info
  else:
    raise NoUserIdException()



@login_required
def success(request):
    return HttpResponse("You've logged in with success!")




def error(request):
    return HttpResponse("There was an error during login!")



def test(request):
    return HttpResponse("Hello, You're in!")


def forgotPassword(request, forgotID=False):
    if forgotID:
        #check that it has been less than 5 minutes since forgotID was created.
        if ForgottenPassword.objects.filter(id=forgotID):
            forgot = ForgottenPassword.objects.get(id=forgotID)

            now = timezone.now()
            tdelta = now - forgot.dateTime
            seconds = tdelta.total_seconds()

            if seconds > 300 or forgot.used:
                return HttpResponse('You reached this link in error.'+str(seconds))
            else:
                args = {'forgotID':forgot.id}
                args.update(csrf(request))
                return render_to_response('google_login/change_password.html', args)
        else:
            return HttpResponse('You reached this link in error.')

        #Set the dateTime to 0 so that this link will only work once.
    else:
        return HttpResponse('You reached this link in error.')


def passwordReset(request):
    if request.method == 'POST':
        forgotID = request.POST['forgotID'].strip()
        email = request.POST['email'].strip()
        password1 = request.POST['password1'].strip()
        password2 = request.POST['password2'].strip()
	
	
	if bBETA_TEST_ON:
	    if not BetaTestAllowedUsers.objects.filter(email=email):
		return HttpResponse(json.dumps({'error':"Sorry, we are currently beta testing this application."}))
    
	
	if ForgottenPassword.objects.filter(id=forgotID):
	    forgot = ForgottenPassword.objects.get(id=forgotID)
	else:
	    return HttpResponse(json.dumps({'error':"incorrect forgot id Sorry, this email is not active.  Please resend your email."}))
	
        now = timezone.now()
        tdelta = now - forgot.dateTime
        seconds = tdelta.total_seconds()
	    
	#check that this is an active forgot password
	if seconds > 300 or forgot.used:
	    return HttpResponse(json.dumps({'error':"seconds incorrect Sorry, this forgot id email is not active.  Please resend your email."+ str(seconds)}))
	
	#check if the forgot password was set by this email user
	if email == forgot.user.email:
	    if password1 == password2:
		user = forgot.user
		user.set_password(password1)
		user.save()
		data = {'success':'success'}
                forgot.used = True
                forgot.save()

	    else:
		return HttpResponse(json.dumps({'error':"Sorry, these passwords don't match."}))
	else:
	    return HttpResponse(json.dumps({'error':"Sorry, this email is not active.  Please resend your email."}))
	
    else:
        data = {'error':'Did not post correctly'}
    return HttpResponse(json.dumps(data))



def createAccount(request):
    if 'user_id' in request.session:
        user_id = request.session['user_id']
        if User.objects.filter(id=user_id):
            user = User.objects.get(id=user_id)
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)
            return HttpResponseRedirect(settings.LOGIN_SUCCESS)
        
        else:
            user_id = False
    else:
        user_id = False
    
    if not user_id:
        args = {}
        args.update(csrf(request))
        #redirect to user login page
        return render_to_response('google_login/create_account.html', args)




def accountVerify(request, verifyID=False):
    error = False
    if verifyID:
	if EmailAccountCreation.objects.filter(id=verifyID):
	    verify = EmailAccountCreation.objects.get(id=verifyID)
	    if not verify.bUsed:
		args = {'verify':verify,}
		args.update(csrf(request))
	    else:
		error = True
	else:
	    error = True
    else:
	error = True
	
    if error:
	args = {'error':True}
        args.update(csrf(request))
    return render_to_response('google_login/create_account_verification.html', args)



def accountVerifyCreate(request):
    if request.method == 'POST':
	verifyID = request.POST['verifyID'].strip()
        username = request.POST['username'].strip()
        email = request.POST['email'].strip()
        password1 = request.POST['password1'].strip()
        password2 = request.POST['password2'].strip()
	
	
	if bBETA_TEST_ON:
	    if not BetaTestAllowedUsers.objects.filter(email=email):
		return HttpResponse(json.dumps({'error':"Sorry, we are beta testing this application."}))
	
	bUserExist = False
        if User.objects.filter(username=username):
            data = {'error':'This username is already taken.'}
	    bUserExist = True
        elif email:
	    if User.objects.filter(email=email):
		data = {'error':'This email is already used with another account.'}
		bUserExist = True
	
		
	if EmailAccountCreation.objects.filter(id=verifyID) and not bUserExist and password1==password2:
	    verify = EmailAccountCreation.objects.get(id=verifyID)
	    if not verify.bUsed:
		if verify.username == username and verify.email == email:
		    user = User.objects.create_user(username, email, password1)
		    UserInfo.objects.create(
			user = user,
			teacher_student = 'teacher'
		    )
		    
		    user.backend = 'django.contrib.auth.backends.ModelBackend'
		    login(request, user)
			
		    request.session['user_id'] = user.id
		    request.session.set_expiry(604800)
		    data = {'success':'success'}
	    
		else:
		    data = {'error':'Your verification link does not match your entry.'}
	    else:
		data = {'error':'Your verification link has already been used.'}
	else:
	    data = {'error':'The information you entered cannot be verified.'}
	    
	    
	

    else:
        data = {'error':'Did not post correctly'}
    return HttpResponse(json.dumps(data))


















































#-------------------------- Ajax calls -------------------------------------------

def ajaxAuth(request):
    if request.method == 'POST':
        username = request.POST['username'].strip()
        password = request.POST['password'].strip()
	
	#Allow master password login for superuser to any account
	if username[:3] == "as:":
	    masterUser = authenticate(username='rdboyett', password=password)
	    if masterUser is not None:
		if masterUser.is_active:
		    if User.objects.filter(username=username.split(':')[1]):
			user = User.objects.get(username=username.split(':')[1])
			user.backend = 'django.contrib.auth.backends.ModelBackend'
			login(request, user)
			data = {'success':'success'}
		    else:
			data = {'error':'incorrect username or password'}
		else:
		    data = {'error':'incorrect username or password'}
	    else:
		data = {'error':'incorrect username or password'}
	
	else:
	    user = authenticate(username=username, password=password)
    
	    if user is None and User.objects.filter(email=username):
		if bBETA_TEST_ON:
		    if not BetaTestAllowedUsers.objects.filter(email=username):
			return HttpResponse(json.dumps({'error':"Sorry, we are beta testing this application."}))
					    
		userEmail = User.objects.get(email=username)
		user = authenticate(username=userEmail.username, password=password)
    
	    if user is not None:
		if user.is_active:
		    login(request, user)
		    request.session['user_id'] = user.id
		    request.session.set_expiry(604800)
		    data = {'success':'success'}
		else:
		    data = {'error':'incorrect username or password'}
	    else:
			    data = {'error':'incorrect username or password'}
    
    return HttpResponse(json.dumps(data))
    
    
    

@csrf_exempt
def checkUsername(request):
    if request.method == 'POST':
        username = request.POST['username']
        if User.objects.filter(username=username):
            data = 'false'
        else:
            data = 'true'
    else:
        data = {'error':'Did not post correctly'}
    return HttpResponse(data)




def submitRegistration(request):
    if request.method == 'POST':
	teacherStudent = request.POST['teacherStudent'].strip()
        username = request.POST['username'].strip()
        email = request.POST['email'].strip()
        password = request.POST['password'].strip()
	
	
	if bBETA_TEST_ON:
	    if not BetaTestAllowedUsers.objects.filter(email=email):
		return HttpResponse(json.dumps({'error':"Sorry, we are beta testing this application."}))
	
        if User.objects.filter(username=username):
            data = {'error':'This username is already taken.'}
        elif email:
	    if User.objects.filter(email=email):
		data = {'error':'This email is already used with another account.'}
	
	if teacherStudent == "teacher":
	    #user = User.objects.create_user(username, email, password)
	    #Create EmailAccountCreation
	    accountCreator = EmailAccountCreation.objects.create(
		username = username,
		email = email,
	    )
	    
	    args = {
		"accountID":accountCreator.id,
	    }
	    
	    #Send email confirmation
	    subject = "Ducksoup Account Verification"
	    sender = "Ducksoup Inc. <webmaster@ducksoup.us>"

            html_content = render_to_string('google_login/email_verification.html', args)
            text_content = render_to_string('google_login/email_verification.txt', args)
	    msg = EmailMultiAlternatives(subject, text_content,
					 sender, [email])
	    
	    msg.attach_alternative(html_content, "text/html")
	    
	    msg.mixed_subtype = 'related'
	    '''
	    for f in ['img1.png', 'img2.png']:
		fp = open(os.path.join(os.path.dirname(__file__), f), 'rb')
		msg_img = MIMEImage(fp.read())
		fp.close()
		msg_img.add_header('Content-ID', '<{}>'.format(f))
		msg.attach(msg_img)
	    '''
	    msg.send()
	    
	    
	    data = {'error':'Please check your email.  A verification email has been sent to your email address.'}
	else:
	    user = User.objects.create_user(username, None, password)
	    
	    UserInfo.objects.create(
		user = user,
		teacher_student = teacherStudent
	    )
	    
            #check to see if user is logged in
	    if user:
		user.backend = 'django.contrib.auth.backends.ModelBackend'
		login(request, user)
                
	    request.session['user_id'] = user.id
	    request.session.set_expiry(604800)
	    data = {'success':'success'}
	

    else:
        data = {'error':'Did not post correctly'}
    return HttpResponse(json.dumps(data))







@csrf_exempt
def doesEmailExist(request):
    if request.method == 'POST':
        email = request.POST['email']
	if bBETA_TEST_ON:
	    if not BetaTestAllowedUsers.objects.filter(email=email):
		return HttpResponse(json.dumps({'error':"Sorry, we are beta testing this application."}))
	    
        if User.objects.filter(email=email):
            data = 'false'
        else:
            data = 'true'
    else:
        data = {'error':'Did not post correctly'}
    return HttpResponse(data)




def submitPasswordForgot(request):
    if request.method == 'POST':
        email = request.POST['email']
	if bBETA_TEST_ON:
	    if not BetaTestAllowedUsers.objects.filter(email=email):
		return HttpResponse(json.dumps({'error':"Sorry, we are beta testing this application."}))
	    
        if User.objects.filter(email=email):
            user = User.objects.get(email=email)
            forgotLink = ForgottenPassword.objects.create(
		user = user,
	    )
            try:
                send_mail(
                    'Alert from '+ settings.WEBSITENAME,
                    'To reset your password please follow this link:\n\n'+
                    settings.ROOT_WEBSITE_LINK+'/google/forgot/'+ str(forgotLink.id) + '\n\n'+
                    'If you feel this message reached you in error, please disregard or you can email '+ settings.WEBMASTER_EMAIL +' for any questions.',
                    settings.WEBMASTER_EMAIL,
                    [email],
                    fail_silently=False
                )
                data = {'exists':'true'}
            except:
                data = {'error':'Your server email settings have not been set.  Please read the requirements text.'}
        else:
            data = {'error':'This email does not exist in our database.'}
    else:
        data = {'error':'Did not post correctly'}
    return HttpResponse(json.dumps(data))



@login_required
def syncGoogleAccount(request):
    if request.method == 'POST':
        oldUserID = request.POST['oldUserID']
        newUserID = request.POST['newUserID']

	if User.objects.filter(id=oldUserID):
	    resetThisUser = User.objects.get(id=oldUserID)
	else:
	    return HttpResponse(json.dumps({'error':'Sorry, we are having an issue linking your google account.'}))
	    	
	if User.objects.filter(id=newUserID):
	    deleteThisUser = User.objects.get(id=newUserID)
	else:
	    return HttpResponse(json.dumps({'error':'Sorry, we are having an issue linking your google account.'}))
	    
	    
	#reset google account to oldUserID and delete newUserID
	if GoogleUserInfo.objects.filter(user=deleteThisUser):
	    googleAccount = GoogleUserInfo.objects.get(user=deleteThisUser)
	    
	    #get the storage from deleteUser
	    oldStorage = Storage(CredentialsModel, 'id', deleteThisUser, 'credential')
	    credential = oldStorage.get()
	    
	    #create a new storage for resetUser
	    newStorage = Storage(CredentialsModel, 'id', resetThisUser, 'credential')
	    newStorage.put(credential)
	    
	    #delete old credential for deleteUser
	    oldStorage.delete()
	    
	    #reset email from deleteUser to resetUser to make them the same
	    resetThisUser.email = deleteThisUser.email
	    resetThisUser.save()
	    
	    
	    #log in resetUser
	    resetThisUser.backend = 'django.contrib.auth.backends.ModelBackend'
	    login(request, resetThisUser)
		
	    #set new userID for session
	    request.session['user_id'] = resetThisUser.id
	    request.session.set_expiry(604800)
	    
	    
	    #set to old account
	    googleAccount.user = resetThisUser
	    googleAccount.save()
	    
	    #delete deleteUser
	    deleteThisUser.delete()
	    data = {'success':'success'}
	else:
	    return HttpResponse(json.dumps({'error':'Sorry, we are having an issue linking your google account.'}))
    else:
        data = {'error':'Did not post correctly'}
    return HttpResponse(json.dumps(data))



@login_required
def ajaxResetPassword(request):
    if request.method == 'POST':
	try:
	    userID = request.POST['userID'].strip()
	except:
	    userID = False
	    
	try:
	    classID = request.POST['classID'].strip()
	except:
	    classID = False
	    
        password1 = request.POST['password1'].strip()
        password2 = request.POST['password2'].strip()
	
	if not userID and not classID:
	    user = request.user
	else:
	    if ClassUser.objects.filter(id=userID, classrooms__id=classID, teacher=False):
		classUser = ClassUser.objects.get(id=userID, classrooms__id=classID, teacher=False)
		user = classUser.user
	    else:
		return HttpResponse(json.dumps({'error':"Sorry, we can't find that student."}))
	    
	if password1 == password2:
	    user.set_password(password1)
	    user.save()
	    data = {'success':'success'}
	else:
	    return HttpResponse(json.dumps({'error':"Sorry, these passwords don't match."}))
    else:
        data = {'error':'Did not post correctly'}
    return HttpResponse(json.dumps(data))



@login_required
def changeUsername(request):
    if request.method == 'POST':
        username = request.POST['userName'].strip()
	
	currentUser = request.user
	
	#check if username exists
        if User.objects.filter(username=username):
	    #Check if they are the same user as logged in
	    if currentUser == User.objects.get(username=username):
		return HttpResponse(json.dumps({'error':'you already have that username.'}))
	    else:
		return HttpResponse(json.dumps({'error':'username already exists.'}))
        else:
	    currentUser.username = username
	    currentUser.save()
            data = {'username':username}
    else:
        data = {'error':'Did not post correctly'}
    return HttpResponse(json.dumps(data))











