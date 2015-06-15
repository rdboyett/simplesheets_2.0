import datetime
from datetime import tzinfo, timedelta

ZERO = timedelta(0)

class UTC(tzinfo):
  def utcoffset(self, dt):
    return ZERO
  def tzname(self, dt):
    return "UTC"
  def dst(self, dt):
    return ZERO

utc = UTC()

import json

from django.shortcuts import render_to_response, redirect
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.core.urlresolvers import reverse

from userInfo_profile.models import UserInfo, MyAnswer, MyGrade, LiveMonitorSession
from worksheet_creator.models import Project, FormInput, BackImage
from classrooms.models import ClassUser, Classroom, HashTag, Message
from google_login.models import GoogleUserInfo
from tourBuilder.models import MyTour
from classrooms.views import generateCode
from payment_tracker.models import PaymentUser
from paypal.standard.ipn.models import PayPalIPN

from paypal.standard.forms import PayPalPaymentsForm

from worksheet_project import settings


#this is commited again


def loginRedirect(request):
    return redirect('/google/auth/')



def index(request):
    if 'user_id' in request.session:
        user_id = request.session['user_id']
        if User.objects.filter(id=user_id):
            user = User.objects.get(id=user_id)
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)
	    request.session.set_expiry(604800)  #Time is in Seconds, this equals 7 days
            return HttpResponseRedirect("/dashboard/")
        
        else:
            user_id = False
    else:
        user_id = False
    
    if not user_id:
        return render_to_response('index.html')
    
    

@login_required
def dashboard(request, *args, **kwargs):
    if UserInfo.objects.filter(user=request.user):
        userInfo = UserInfo.objects.get(user=request.user)
    else:
        userInfo = UserInfo.objects.create(
            user = request.user
        )
        return HttpResponseRedirect("/edit-profile/")
    
    #Check if it's a new user
    if not request.user.first_name or not request.user.last_name or not userInfo.teacher_student:
        return HttpResponseRedirect("/edit-profile/")
    
    if GoogleUserInfo.objects.filter(user=request.user):
        googleUserInfo = GoogleUserInfo.objects.get(user=request.user)
    else:
        googleUserInfo = False
        
    
    if userInfo.projects.all():
        allProjects = userInfo.projects.all().order_by('status','-modifiedDate', 'title')
    else:
        allProjects = False
    
    #Get all users Classes
    if ClassUser.objects.filter(user=request.user):
        classUser = ClassUser.objects.get(user=request.user)
    else:
        if userInfo.teacher_student == 'teacher':
            teacher = True
        else:
            teacher = False
        classUser = ClassUser.objects.create(
            user = request.user,
            teacher = teacher,
        )
        
    if classUser.teacher and settings.PAYMENT_TRACKER_ON:
        bPaidUp=False
        if PaymentUser.objects.filter(user=request.user):
            payUser = PaymentUser.objects.get(user=request.user)
            #first check if they have a bFreeUser account
            if not payUser.bFreeUser:
                #next check if lastProjectDate is more than a month
                if payUser.lastProjectDate:
                    today = datetime.datetime.now()
                    timediff = today - payUser.lastProjectDate
                    if timediff.days > 30:
                        bPaidUp = True
                
                #next check numberOfProjects is greater than 5
                if payUser.numberOfProjects < 6:
                    bPaidUp=True
                    
                #next check paymentType and next nextPaymentDate
                invoiceStart = request.user.first_name[0]+"-"+request.user.last_name[:2]+"-"+str(request.user.id)
                if PayPalIPN.objects.filter(invoice__istartswith=invoiceStart).exclude(txn_type='subscr_signup'):
                    payPalObjects = PayPalIPN.objects.filter(invoice__istartswith=invoiceStart).exclude(txn_type='subscr_signup').order_by('-payment_date')
                    payPalObj = payPalObjects[0]
                    if payPalObj.item_name == "Ducksoup Subscription":
                        today = datetime.datetime.now(utc)
                        timediff = today - payPalObj.payment_date
                        if timediff.days <= 33:
                            bPaidUp = True
                    elif payPalObj.item_name == "Ducksoup Onetime 1 Year Payment":
                        today = datetime.datetime.now(utc)
                        timediff = today - payPalObj.payment_date
                        if timediff.days <= 365:
                            bPaidUp = True
            else:
                bPaidUp = True
        else:
            payUser = PaymentUser.objects.create(user=request.user)
            bPaidUp = True
            
        if bPaidUp:
            payUser.bPaidUp = bPaidUp
            payUser.save()
        
    #Get all users Class
    if classUser.classrooms.all():
        allClasses = classUser.classrooms.all().order_by('name')
    else:
        allClasses = False
    
    
    if 'error' in request.session:
        error = request.session['error']
        if classUser.teacher:
            del request.session['error']
    else:
        error = False
    
    
    args = {
            "error":error,
            "dashboard":True,
            "userInfo":userInfo,
            "googleUserInfo":googleUserInfo,
            "allClasses":allClasses,
            "classUser":classUser,
            "randomNumber":['1','2','3','4','5','6'],
            "allProjects":allProjects,
        }
    args.update(csrf(request))
    
    
    return render_to_response('dashboard.html', args)



@login_required
def showNextPage(request, projectID=False, pageNumber=False, classID=False):
    if not projectID:
        return HttpResponseRedirect("/worksheet/pickFile/")
    
    if not pageNumber:
        pageNumber = 1
    
    (newProject, userInfo, bTeacher) = checkIfTeacher(request.user, projectID)
    
    if newProject:
        newProject.modifiedDate = datetime.datetime.now()
        newProject.save()
    
    #Check if it's a new user
    if not request.user.first_name or not request.user.last_name or not userInfo.teacher_student:
        return HttpResponseRedirect("/edit-profile/")
    
    if GoogleUserInfo.objects.filter(user=request.user):
        googleUserInfo = GoogleUserInfo.objects.get(user=request.user)
    else:
        googleUserInfo = False
    
    
    #Get all users Classes
    if ClassUser.objects.filter(user=request.user):
        classUser = ClassUser.objects.get(user=request.user)
    else:
        if userInfo.teacher_student == 'teacher':
            teacher = True
        else:
            teacher = False
        classUser = ClassUser.objects.create(
            user = request.user,
            teacher = teacher,
        )
        
    #Get all users Class
    if classUser.classrooms.all():
        allClasses = classUser.classrooms.all().order_by('name')
    else:
        allClasses = False
    
    
    
    
    
    
    if newProject:
        totalPages = int(newProject.backgroundImages.all().count())
        if newProject.formInputs.all():
            formInputs = newProject.formInputs.all().order_by('pageNumber', 'questionNumber')
        else:
            formInputs = False
            
        if MyAnswer.objects.filter(userInfo=userInfo, project=newProject):
            myAnswers = MyAnswer.objects.filter(userInfo=userInfo, project=newProject)
        else:
            myAnswers = False
            
        if bTeacher:
            webPage = 'edit_worksheet.html'
        else:
            webPage = 'student_worksheet.html'
            
        #Get my grade for this project (if there is one)
        if MyGrade.objects.filter(project=newProject, userInfo=userInfo, highestGrade=True):
            myGrade = MyGrade.objects.filter(project=newProject, userInfo=userInfo, highestGrade=True).order_by('-dateTime')[0]
        else:
            myGrade = False
        
        tourName = 'edit_worksheet'
        if MyTour.objects.filter(name=tourName, user=request.user):
            myTour = MyTour.objects.get(name=tourName, user=request.user)
            if myTour.nTimesRan >= myTour.nManditoryRuns:
                myTour = False
        else:
            myTour = MyTour.objects.create(
                user = request.user,
                name = tourName,
                nManditoryRuns = 1,
                nTimesRan = 0,
            )
            
        args = {
                "worksheet":True,
                  'user':request.user,
                "userInfo":userInfo,
                "googleUserInfo":googleUserInfo,
                "allClasses":allClasses,
                "classUser":classUser,
                'newProject':newProject,
                'myAnswers':myAnswers,
                'myGrade':myGrade,
                'pageNumber':int(pageNumber),
                'totalPages':int(totalPages),
                'pageRange':range(int(totalPages)),
                'formInputs':formInputs,
                'bTeacher':bTeacher,
                'classID':classID,
                'myTour':myTour,
                'resetTour':tourName,
            }
        args.update(csrf(request))
    
            
            
            
        return render_to_response(webPage, args)
    else:
        return render_to_response('error_page.html', {'error':"Oops! We can't find that worksheet.",})






@login_required
def handGrade(request, projectID=False, pageNumber=False, classID=False, studentID=False):
    if not projectID:
        return HttpResponseRedirect("/worksheet/pickFile/")
    
    if not pageNumber:
        pageNumber = 1
    
    (newProject, userInfo, bTeacher) = checkIfTeacher(request.user, projectID)
    
    
    if newProject:
        newProject.modifiedDate = datetime.datetime.now()
        newProject.save()
    
    if GoogleUserInfo.objects.filter(user=request.user):
        googleUserInfo = GoogleUserInfo.objects.get(user=request.user)
    else:
        googleUserInfo = False
    
    
    #Get all users Classes
    if ClassUser.objects.filter(user=request.user):
        classUser = ClassUser.objects.get(user=request.user)
    else:
        if userInfo.teacher_student == 'teacher':
            teacher = True
        else:
            teacher = False
        classUser = ClassUser.objects.create(
            user = request.user,
            teacher = teacher,
        )
        
    if not bTeacher:
        request.session['error'] = 'Sorry, you must be a teacher to view this page.'
        request.session.set_expiry(300)
        return redirect('worksheet_project.views.dashboard')
        
        
    #Get all users Class
    if classUser.classrooms.all():
        allClasses = classUser.classrooms.all().order_by('name')
    else:
        allClasses = False
    
    
    
    if not classID and Classroom.objects.filter(worksheets=newProject):
        classID = Classroom.objects.filter(worksheets=newProject)[0].id
    elif not classID and not Classroom.objects.filter(worksheets=newProject):
        request.session['error'] = 'Sorry, there are no classes assigned this e-sheet.'
        request.session.set_expiry(300)
        return redirect('worksheet_project.views.dashboard')
    
    if ClassUser.objects.filter(classrooms__id=classID, teacher=False):
        allStudents = ClassUser.objects.filter(classrooms__id=classID, teacher=False).order_by('user__last_name')
    else:
        allStudents = False
        
    if Classroom.objects.filter(worksheets=newProject):
        allProjectClasses = Classroom.objects.filter(worksheets=newProject).order_by('name')
    else:
        allProjectClasses = False
        
    #get student userInfo
    if not studentID and allStudents:
        studentID = allStudents[0].id
    elif not studentID and not allStudents:
        request.session['error'] = 'Sorry, there are no students assigned this e-sheet.'
        request.session.set_expiry(300)
        return redirect('worksheet_project.views.dashboard')
    
    if ClassUser.objects.filter(id=studentID):
        studentClassUser = ClassUser.objects.get(id=studentID)
        if UserInfo.objects.filter(user=studentClassUser.user):
            studentUserInfo = UserInfo.objects.get(user=studentClassUser.user)
        else:
            return render_to_response('error_page.html', {'error':"Oops! We can't find that student.",})
    
    
    #Load the project, inputs and student's answers
    if newProject:
        totalPages = int(newProject.backgroundImages.all().count())
        if newProject.formInputs.all():
            formInputs = newProject.formInputs.all().order_by('pageNumber', 'questionNumber')
        else:
            formInputs = False
            
        if MyAnswer.objects.filter(userInfo=studentUserInfo, project=newProject):
            myAnswers = MyAnswer.objects.filter(userInfo=studentUserInfo, project=newProject).order_by('answer__pageNumber','answer__questionNumber')
        else:
            myAnswers = False
            
        #Get my grade for this project (if there is one)
        if MyGrade.objects.filter(project=newProject, userInfo=studentUserInfo, highestGrade=True):
            myGrade = MyGrade.objects.filter(project=newProject, userInfo=studentUserInfo, highestGrade=True).order_by('-dateTime')[0]
        else:
            myGrade = False
        
        
        tourName = 'handGrade'
        if MyTour.objects.filter(name=tourName, user=request.user):
            myTour = MyTour.objects.get(name=tourName, user=request.user)
            if myTour.nTimesRan >= myTour.nManditoryRuns:
                myTour = False
        else:
            myTour = MyTour.objects.create(
                user = request.user,
                name = tourName,
                nManditoryRuns = 1,
                nTimesRan = 0,
            )
            
        
        args = {
                "worksheet":True,
                  'user':request.user,
                "userInfo":userInfo,
                "studentClassUser":studentClassUser,
                "studentUserInfo":studentUserInfo,
                "googleUserInfo":googleUserInfo,
                "allClasses":allClasses,
                "allStudents":allStudents,
                "allProjectClasses":allProjectClasses,
                "classUser":classUser,
                  'newProject':newProject,
                  'myAnswers':myAnswers,
                  'myGrade':myGrade,
                  'pageNumber':int(pageNumber),
                  'totalPages':int(totalPages),
                  'pageRange':range(int(totalPages)),
                  'formInputs':formInputs,
                  'bTeacher':bTeacher,
                  'classID':classID,
                  'myTour':myTour,
                  'resetTour':tourName,
            }
        args.update(csrf(request))
    
            
            
            
        return render_to_response('handGrade_worksheet.html', args)
    else:
        return render_to_response('error_page.html', {'error':"Oops! We can't find that worksheet.",})




@login_required
def classes(request, classID=False):
    if UserInfo.objects.filter(user=request.user):
        userInfo = UserInfo.objects.get(user=request.user)
    else:
        userInfo = False
    
    #Check if it's a new user
    if not request.user.first_name or not request.user.last_name or not userInfo.teacher_student:
        return HttpResponseRedirect("/edit-profile/")
    
    #Get all users Classes
    if ClassUser.objects.filter(user=request.user):
        classUser = ClassUser.objects.get(user=request.user)
    else:
        if userInfo.teacher_student == 'teacher':
            teacher = True
        else:
            teacher = False
        classUser = ClassUser.objects.create(
            user = request.user,
            teacher = teacher,
        )
        
        
        
    if classUser.teacher and settings.PAYMENT_TRACKER_ON:
        bPaidUp=False
        if PaymentUser.objects.filter(user=request.user):
            payUser = PaymentUser.objects.get(user=request.user)
            #first check if they have a bFreeUser account
            if not payUser.bFreeUser:
                #next check if lastProjectDate is more than a month
                if payUser.lastProjectDate:
                    today = datetime.datetime.now()
                    timediff = today - payUser.lastProjectDate
                    if timediff.days > 30:
                        bPaidUp = True
                
                #next check numberOfProjects is greater than 5
                if payUser.numberOfProjects < 6:
                    bPaidUp=True
                    
                #next check paymentType and next nextPaymentDate
                invoiceStart = request.user.first_name[0]+"-"+request.user.last_name[:2]+"-"+str(request.user.id)
                if PayPalIPN.objects.filter(invoice__istartswith=invoiceStart).exclude(txn_type='subscr_signup'):
                    payPalObjects = PayPalIPN.objects.filter(invoice__istartswith=invoiceStart).exclude(txn_type='subscr_signup').order_by('-payment_date')
                    payPalObj = payPalObjects[0]
                    if payPalObj.item_name == "Ducksoup Subscription":
                        today = datetime.datetime.now(utc)
                        timediff = today - payPalObj.payment_date
                        if timediff.days <= 33:
                            bPaidUp = True
                    elif payPalObj.item_name == "Ducksoup Onetime 1 Year Payment":
                        today = datetime.datetime.now(utc)
                        timediff = today - payPalObj.payment_date
                        if timediff.days <= 365:
                            bPaidUp = True
            else:
                bPaidUp = True
        else:
            payUser = PaymentUser.objects.create(user=request.user)
            bPaidUp = True
            
        if bPaidUp:
            payUser.bPaidUp = bPaidUp
            payUser.save()
        
        
        
    #Get current Class
    if classID:
        if Classroom.objects.filter(id=classID):
            currentClass = Classroom.objects.get(id=classID)
            if not Classroom.objects.filter(classuser=classUser):
                return redirect('worksheet_project.views.classes')
        else:
            currentClass = False
    else:
        currentClass = False
        
    #Get all users Class
    if classUser.classrooms.all():
        allClasses = classUser.classrooms.all().order_by('name')
        if not currentClass:
            currentClass = allClasses[0]
    else:
        allClasses = False
    
    
    
    if GoogleUserInfo.objects.filter(user=request.user):
        googleUserInfo = GoogleUserInfo.objects.get(user=request.user)
    else:
        googleUserInfo = False
    
    #get all the students for this class
    if ClassUser.objects.filter(classrooms=currentClass, teacher=False):
        students = ClassUser.objects.filter(classrooms=currentClass, teacher=False)
    else:
        students = False

    if 'error' in request.session:
        error = request.session['error']
        del request.session['error']
    else:
        error = False
    
    args = {
            "error":error,
            "classes":True,
            "userInfo":userInfo,
            "classUser":classUser,
            "students":students,
            "currentClass":currentClass,
            "allClasses":allClasses,
            "googleUserInfo":googleUserInfo,
            "randomNumber":['1','2','3','4','5','6'],
        }
    args.update(csrf(request))
        
    return render_to_response('classes.html', args)


@login_required
def monitor(request, projectID=False, classID=False):
    if UserInfo.objects.filter(user=request.user):
        userInfo = UserInfo.objects.get(user=request.user)

    if GoogleUserInfo.objects.filter(user=request.user):
        googleUserInfo = GoogleUserInfo.objects.get(user=request.user)
    else:
        googleUserInfo = False

    #Get all users Classes
    if ClassUser.objects.filter(user=request.user):
        classUser = ClassUser.objects.get(user=request.user)
    else:
        if userInfo.teacher_student == 'teacher':
            teacher = True
        else:
            teacher = False
        classUser = ClassUser.objects.create(
            user = request.user,
            teacher = teacher,
        )
        
    htmlPage = 'monitor.html'
    #Check if teacher
    if not classUser.teacher:
        return redirect('/classes/')
        
        
        
    #Get current Worksheet Project
    if projectID:
        if Project.objects.filter(id=projectID):
            currentProject = Project.objects.get(id=projectID)
        else:
            currentProject = False
    else:
        return redirect('/dashboard/')
        
    #Get all users Class
    if classUser.classrooms.all():
        allClasses = classUser.classrooms.all().order_by('name')
    else:
        allClasses = False
    
    if not classID:  #check to see if we are loading only 1 class for live view session
        #Get all the students in this class that are assigned
        #first reverse lookup all the classes with project
        if Classroom.objects.filter(worksheets__id=currentProject.id):
            classrooms = Classroom.objects.filter(worksheets__id=currentProject.id)
        else:
            classrooms = False
        liveClassroom = False
    else:
        if Classroom.objects.filter(id=classID):
            liveClassroom = Classroom.objects.get(id=classID)
        else:
            liveClassroom = False
        classrooms = False
        
    classesAndStudents = []
    #get all the users in each class and store it in an object
    if classrooms:
        for currentClass in classrooms:
            if ClassUser.objects.filter(classrooms__id=currentClass.id, teacher=False):
                students = ClassUser.objects.filter(classrooms__id=currentClass.id, teacher=False)
                classesAndStudents.append({'class':currentClass, 'students':students})
            else:
                classesAndStudents.append({'class':currentClass})
        
        if not classesAndStudents:
            classesAndStudents = 'no students'
            
        htmlPage = 'monitor.html'
        
    elif liveClassroom:
        if ClassUser.objects.filter(classrooms__id=liveClassroom.id, teacher=False):
            students = ClassUser.objects.filter(classrooms__id=liveClassroom.id, teacher=False)
            classesAndStudents.append({'class':liveClassroom, 'students':students})
        else:
            classesAndStudents.append({'class':liveClassroom})
        
        if not classesAndStudents:
            classesAndStudents = 'no students'
            
        #Now create a live session for to track student answers.
        if LiveMonitorSession.objects.filter(project=currentProject, classroom=liveClassroom):
            liveSession = LiveMonitorSession.objects.get(project=currentProject, classroom=liveClassroom)
            liveSession.answers.clear()
        else:
            liveSession = LiveMonitorSession.objects.create(
                project=currentProject,
                classroom=liveClassroom,
            )
            
        htmlPage = 'live_monitor.html'
    
    args = {
            "worksheet":True,
            "userInfo":userInfo,
            "googleUserInfo":googleUserInfo,
            "allClasses":allClasses,
            "monitor":True,
            "classUser":classUser,
            "currentProject":currentProject,
            'classesAndStudents':classesAndStudents,
        }
    args.update(csrf(request))
        

    return render_to_response(htmlPage, args)



@login_required
def profile(request):
    if UserInfo.objects.filter(user=request.user):
        userInfo = UserInfo.objects.get(user=request.user)
    else:
        userInfo = False
        
    #if there is a google account
    if GoogleUserInfo.objects.filter(user=request.user):
        googleUserInfo = GoogleUserInfo.objects.get(user=request.user)
    else:
        googleUserInfo = False
        
    #check if teacher or student is set
    if not userInfo.teacher_student:
        teacherStudent = False
    else:
        teacherStudent = True
        
    #Get all users Classes
    if ClassUser.objects.filter(user=request.user):
        classUser = ClassUser.objects.get(user=request.user)
    else:
        if userInfo.teacher_student == 'teacher':
            teacher = True
        else:
            teacher = False
        classUser = ClassUser.objects.create(
            user = request.user,
            teacher = teacher,
        )
        
    if classUser.teacher and settings.PAYMENT_TRACKER_ON:
        bPaidUp=False
        if PaymentUser.objects.filter(user=request.user):
            payUser = PaymentUser.objects.get(user=request.user)
            #first check if they have a bFreeUser account
            if not payUser.bFreeUser:
                #next check if lastProjectDate is more than a month
                if payUser.lastProjectDate:
                    today = datetime.datetime.now()
                    timediff = today - payUser.lastProjectDate
                    if timediff.days > 30:
                        bPaidUp = True
                
                #next check numberOfProjects is greater than 5
                if payUser.numberOfProjects < 6:
                    bPaidUp=True
                    
                #next check paymentType and next nextPaymentDate
                invoiceStart = request.user.first_name[0]+"-"+request.user.last_name[:2]+"-"+str(request.user.id)
                if PayPalIPN.objects.filter(invoice__istartswith=invoiceStart).exclude(txn_type='subscr_signup'):
                    payPalObjects = PayPalIPN.objects.filter(invoice__istartswith=invoiceStart).exclude(txn_type='subscr_signup').order_by('-payment_date')
                    payPalObj = payPalObjects[0]
                    if payPalObj.item_name == "Ducksoup Subscription":
                        today = datetime.datetime.now(utc)
                        timediff = today - payPalObj.payment_date
                        if timediff.days <= 33:
                            bPaidUp = True
                    elif payPalObj.item_name == "Ducksoup Onetime 1 Year Payment":
                        today = datetime.datetime.now(utc)
                        timediff = today - payPalObj.payment_date
                        if timediff.days <= 365:
                            bPaidUp = True
            else:
                bPaidUp = True
        else:
            payUser = PaymentUser.objects.create(user=request.user)
            bPaidUp = True
            
        if bPaidUp:
            payUser.bPaidUp = bPaidUp
            payUser.save()
        
        
    #Get all users Class
    if classUser.classrooms.all():
        allClasses = classUser.classrooms.all().order_by('name')
    else:
        allClasses = False
    
    
    if MyTour.objects.filter(name='profile', user=request.user):
        myTour = MyTour.objects.get(name='profile', user=request.user)
        if myTour.nTimesRan >= myTour.nManditoryRuns:
            myTour = False
    else:
        myTour = MyTour.objects.create(
            user = request.user,
            name = 'profile',
            nManditoryRuns = 1,
            nTimesRan = 0,
        )
        
    
    args = {
            "profile":True,
            "user":request.user,
            "userInfo":userInfo,
            "googleUserInfo":googleUserInfo,
            "teacherStudent":teacherStudent,
            "classUser":classUser,
            "allClasses":allClasses,
            "myTour":myTour,
        }
    args.update(csrf(request))
        
    return render_to_response('profile.html', args)



@login_required
def assign(request, projectID=False):
    if UserInfo.objects.filter(user=request.user):
        userInfo = UserInfo.objects.get(user=request.user)
    else:
        userInfo = False
    
    #Get all users Classes
    if ClassUser.objects.filter(user=request.user):
        classUser = ClassUser.objects.get(user=request.user)
    else:
        if userInfo.teacher_student == 'teacher':
            teacher = True
        else:
            teacher = False
            
        classUser = ClassUser.objects.create(
            user = request.user,
            teacher = teacher,
        )
        
    #Check if teacher
    if not classUser.teacher:
        return redirect('/classes/')
        
    #Get current Worksheet Project
    if projectID:
        if Project.objects.filter(id=projectID):
            currentProject = Project.objects.get(id=projectID)
            allProjects = False
        else:
            currentProject = False
    else:
        currentProject = False
        if userInfo.projects.all():
            allProjects = userInfo.projects.all().order_by('status','-modifiedDate', 'title')
        else:
            allProjects = False
        
    #Get all users Worksheet Projects
    if classUser.classrooms.all():
        allClasses = classUser.classrooms.all().order_by('name')
    else:
        allClasses = False
    
    
    if GoogleUserInfo.objects.filter(user=request.user):
        googleUserInfo = GoogleUserInfo.objects.get(user=request.user)
    else:
        googleUserInfo = False


    args = {
            "worksheet":True,
            "userInfo":userInfo,
            "classUser":classUser,
            "allProjects":allProjects,
            "currentProject":currentProject,
            "allClasses":allClasses,
            "googleUserInfo":googleUserInfo,
            "assign":True,
            "randomNumber":['1','2','3','4','5','6'],
        }
    args.update(csrf(request))
        
    return render_to_response('assign.html', args)







@login_required
def worksheet_display(request, projectID=False):
    if UserInfo.objects.filter(user=request.user):
        userInfo = UserInfo.objects.get(user=request.user)
    else:
        userInfo = False
    
    #Get all users Classes
    if ClassUser.objects.filter(user=request.user):
        classUser = ClassUser.objects.get(user=request.user)
    else:
        if userInfo.teacher_student == 'teacher':
            teacher = True
        else:
            teacher = False
        classUser = ClassUser.objects.create(
            user = request.user,
            teacher = teacher,
        )
        
    #Get current Worksheet Project
    if projectID:
        if Project.objects.filter(id=projectID):
            currentProject = Project.objects.get(id=projectID)
        else:
            return redirect('/dashboard/')
    else:
        return redirect('/dashboard/')
        
    #Get all users Worksheet Projects
    if classUser.classrooms.all():
        allClasses = classUser.classrooms.all().order_by('name')
    else:
        allClasses = False
    
    #Get Answers for Students
    if MyAnswer.objects.filter(userInfo=userInfo, project=currentProject):
        myAnswers = MyAnswer.objects.filter(userInfo=userInfo, project=currentProject).order_by('answer__pageNumber', 'answer__questionNumber')
    else:
        myAnswers = False
    
    #Get Student grade for this project (if there is one)
    if MyGrade.objects.filter(project=currentProject, userInfo=userInfo):
        myGrade = MyGrade.objects.filter(project=currentProject, userInfo=userInfo).order_by('-dateTime')[0]
    else:
        myGrade = False
        
    
    
    if GoogleUserInfo.objects.filter(user=request.user):
        googleUserInfo = GoogleUserInfo.objects.get(user=request.user)
    else:
        googleUserInfo = False


    #Get the number of students completed worksheet and average correct answers for each question and total average on worksheet
    if MyGrade.objects.filter(project=currentProject):
        pass

    args = {
            "worksheet":True,
            "userInfo":userInfo,
            "classUser":classUser,
            'myAnswers':myAnswers,
            "myGrade":myGrade,
            "allClasses":allClasses,
            "googleUserInfo":googleUserInfo,
            "randomNumber":['1','2','3','4','5','6'],
            "currentProject":currentProject
        }
    args.update(csrf(request))
        
    return render_to_response('worksheet_display.html', args)




@login_required
def student_display(request, classID=False, studentID=False):
    if UserInfo.objects.filter(user=request.user):
        userInfo = UserInfo.objects.get(user=request.user)
    else:
        userInfo = False
    
    #Get all users Classes
    if ClassUser.objects.filter(user=request.user):
        classUser = ClassUser.objects.get(user=request.user)
    else:
        if userInfo.teacher_student == 'teacher':
            teacher = True
        else:
            teacher = False
        classUser = ClassUser.objects.create(
            user = request.user,
            teacher = teacher,
        )
        
    #Get all users Worksheet Projects
    if classUser.classrooms.all():
        allClasses = classUser.classrooms.all().order_by('name')
    else:
        allClasses = False
        
        
    #Get current Class
    if classID:
        if Classroom.objects.filter(id=classID):
            currentClass = Classroom.objects.get(id=classID)
        else:
            return redirect('/classes/')
    else:
        return redirect('/classes/')
        
        
    #Get current Student:
    if ClassUser.objects.filter(id=studentID, teacher=False, classrooms=currentClass):
        student = ClassUser.objects.get(id=studentID, teacher=False, classrooms=currentClass)
    else:
        if classID:
            return redirect('/classes/'+str(classID))
        else:
            return redirect('/classes/')
    
    if GoogleUserInfo.objects.filter(user=request.user):
        googleUserInfo = GoogleUserInfo.objects.get(user=request.user)
    else:
        googleUserInfo = False

    #get all the students for this class
    if ClassUser.objects.filter(classrooms=currentClass, teacher=False):
        students = ClassUser.objects.filter(classrooms=currentClass, teacher=False)
    else:
        students = False

    args = {
            "classes":True,
            "userInfo":userInfo,
            "classUser":classUser,
            "student":student,
            "students":students,
            "allClasses":allClasses,
            "currentClass":currentClass,
            "googleUserInfo":googleUserInfo,
            "randomNumber":['1','2','3','4','5','6'],
        }
    args.update(csrf(request))
        
    return render_to_response('student_display.html', args)




@login_required
def initiatePayment(request):
    if UserInfo.objects.filter(user=request.user):
        userInfo = UserInfo.objects.get(user=request.user)
    else:
        userInfo = False
        
    #if there is a google account
    if GoogleUserInfo.objects.filter(user=request.user):
        googleUserInfo = GoogleUserInfo.objects.get(user=request.user)
    else:
        googleUserInfo = False
        
    #check if teacher or student is set
    if not userInfo.teacher_student:
        teacherStudent = False
    else:
        teacherStudent = True
        
    #Get all users Classes
    if ClassUser.objects.filter(user=request.user):
        classUser = ClassUser.objects.get(user=request.user)
    else:
        if userInfo.teacher_student == 'teacher':
            teacher = True
        else:
            teacher = False
        classUser = ClassUser.objects.create(
            user = request.user,
            teacher = teacher,
        )
        
    #Get all users Class
    if classUser.classrooms.all():
        allClasses = classUser.classrooms.all().order_by('name')
    else:
        allClasses = False
    
    
    if MyTour.objects.filter(name='profile', user=request.user):
        myTour = MyTour.objects.get(name='profile', user=request.user)
        if myTour.nTimesRan >= myTour.nManditoryRuns:
            myTour = False
    else:
        myTour = MyTour.objects.create(
            user = request.user,
            name = 'profile',
            nManditoryRuns = 1,
            nTimesRan = 0,
        )
        
    
    
    
    baseWebsite = "http://ducksoup.us"
    # What you want the button to do.
    userInfo_dict = {"userID":request.user.id, "classUserID": classUser.id, "userInfoID":userInfo.id}
    monthly_paypal_dict = {
        "cmd": "_xclick-subscriptions",
        "business": settings.PAYPAL_RECEIVER_EMAIL,
        "a3": "9.99",                      # monthly price
        "p3": 1,                           # duration of each unit (depends on unit)
        "t3": "M",                         # duration unit ("M for Month")
        "src": "1",                        # make payments recur
        "sra": "1",                        # reattempt payment on payment error
        "no_note": "1",                    # remove extra notes (optional)
        "item_name": "Ducksoup Subscription",
        "invoice": request.user.first_name[0]+"-"+request.user.last_name[:2]+"-"+str(request.user.id)+"-"+str(generateCode()),
        "custom": userInfo_dict,
        "page_style": "Duck_Soup_1",
        "cpp_cart_border_color": "ffd777",
        "cpp_header_image": "http://ducksoup.us/static/icons/paypalDuckBanner-750x90.png",
        "cpp_headerback_color": "ffd777",
        "cpp_headerborder_color": "ffd777",
        "cpp_logo_image": "http://ducksoup.us/static/icons/paypalDuckBanner-180x60.png",
        "cpp_payflow_color": "ffd777",
        "rm": "2",
        "cbt": "Return to Duck Soup Inc.",
        "notify_url": baseWebsite+reverse('paypal-ipn'),
        "return_url": baseWebsite+reverse('worksheet_project.views.paypalReturn'),
        "cancel_return": baseWebsite+reverse('worksheet_project.views.initiatePayment'),
    }
    yearly_paypal_dict = {
        "business": settings.PAYPAL_RECEIVER_EMAIL,
        "amount": "99.99",
        "item_name": "Ducksoup Onetime 1 Year Payment",
        "invoice": request.user.first_name[0]+"-"+request.user.last_name[:2]+"-"+str(request.user.id)+"-"+str(generateCode()),
        "custom": userInfo_dict,
        "page_style": "Duck_Soup_1",
        "cpp_cart_border_color": "ffd777",
        "cpp_header_image": "http://ducksoup.us/static/icons/paypalDuckBanner-750x90.png",
        "cpp_headerback_color": "ffd777",
        "cpp_headerborder_color": "ffd777",
        "cpp_logo_image": "http://ducksoup.us/static/icons/paypalDuckBanner-180x60.png",
        "cpp_payflow_color": "ffd777",
        "rm": "2",
        "cbt": "Return to Duck Soup Inc.",
        "notify_url": baseWebsite+reverse('paypal-ipn'),
        "return_url": baseWebsite+reverse('worksheet_project.views.paypalReturn'),
        "cancel_return": baseWebsite+reverse('worksheet_project.views.initiatePayment'),
    }

    # Create the instance.
    yearlyForm = PayPalPaymentsForm(initial=yearly_paypal_dict)

    # Create the instance.
    monthlyForm = PayPalPaymentsForm(initial=monthly_paypal_dict, button_type="subscribe")

    args = {
            "monthlyForm":monthlyForm,
            "yearlyForm":yearlyForm,
            "profile":True,
            "user":request.user,
            "userInfo":userInfo,
            "googleUserInfo":googleUserInfo,
            "teacherStudent":teacherStudent,
            "classUser":classUser,
            "allClasses":allClasses,
            "myTour":myTour,
        }
    args.update(csrf(request))
        
    return render_to_response('paypal.html', args)





@login_required
@csrf_exempt
def paypalReturn(request):
    if request.method == 'POST':
        post = request.POST #django user
        #custom #{"userID":request.user.id, "classUserID": classUser.id, "userInfoID":userInfo.id}
        #invoice #this is unique request.user.first_name[0]+"-"+request.user.last_name[:4]+"-"+str(request.user.id)+"-"+str(generateCode()),
        #item_name #Ducksoup Onetime 1 Year Payment for 99.99 year #Ducksoup Subscription for 9.99/mo
        #txn_type  #web_accept means 99.99 year #subscr_signup is for 9.99/mo
        #first_name
        #last_name
        #payer_email
        #payer_id
        
        #only for subscribe 9.99/mo
        #subscr_id
        #period3 #1 M
        #amount3 #9.99
        #subscr_date #16:12:57 Jun 14, 2015 PDT
        
        #only for web_accept 99.99 year
        #txn_id
        #payment_gross
        #payment_fee
        #payment_date #15:59:31 Jun 14, 2015 PDT
        
        if PaymentUser.objects.filter(user=request.user):
            payUser = PaymentUser.objects.get(user=request.user)
            payUser.paymentType = post['txn_type'].strip()
            payUser.bPaidUp = True
            payUser.lastPaymentDate = datetime.datetime.now()
            
            if payUser.paymentType == "web_accept":
                payUser.nextPaymentDate = datetime.datetime.now() + datetime.timedelta(days=365)
            elif payUser.paymentType == "subscr_signup":
                payUser.nextPaymentDate = datetime.datetime.now() + datetime.timedelta(days=31)
                
            payUser.payer_email = post['payer_email'].strip()
            payUser.payer_id = post['payer_email'].strip()
            
            if PayPalIPN.objects.filter(invoice=post['invoice'].strip()):
                payPalObjects = PayPalIPN.objects.filter(invoice=post['invoice'].strip())
                for payPalObj in payPalObjects:
                    payUser.payments.add(payPalObj)
                
            payUser.save()
        
        
        
        return HttpResponse(json.dumps(post))
    else:
        return HttpResponse("no post")











#*******************  Testings Purposes  ***********************************************

def test(request):
    return HttpResponse('your in test')






#------------------------------------------------- Misc Functions -----------------------------------------------#

def checkIfTeacher(user, project_id):
    #get userInfo for Worksheet Owner
    if Project.objects.filter(id=project_id):
        project = Project.objects.get(id=project_id)
        projectUserList = project.userinfo_set.all()
    else:
        return (False, False, False)
    
    #get userInfo for Logged in user
    if UserInfo.objects.filter(user=user):
        loggedUserInfo = UserInfo.objects.get(user=user)
    else:
        return (False, False, False)
    
    #compare userInfo and set as teacher or student
    for ownerUserInfo in projectUserList:
        if ownerUserInfo == loggedUserInfo:
            return (project, loggedUserInfo, True)
            
    return (project, loggedUserInfo, False)
    



'''
Merging long git commit messages:

1-press "i"
2-write your merge message
3-press "esc"
4-write ":wq" then press enter

'''














