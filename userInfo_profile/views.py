import os
ROOT_PATH = os.path.dirname(__file__)

import json
import errno
import httplib2
import shutil

from django.shortcuts import render_to_response, redirect, get_object_or_404
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from userInfo_profile.models import UserInfo, MyGrade
from userInfo_profile import settings
from classrooms.models import ClassUser, Classroom
from worksheet_creator.models import Project



from apiclient.discovery import build
from oauth2client.django_orm import Storage
from apiclient.http import MediaFileUpload
from apiclient import errors


from google_login.models import CredentialsModel


import logging
log = logging.getLogger(__name__)






@login_required
def school(request):
    if request.method == 'POST':
        schoolName = request.POST["schoolName"]
        
        schoolName = schoolName.strip(' \t\n\r')
        schoolName = schoolName.title()
        
        data = {
            'schoolName': schoolName,
        }
        if UserInfo.objects.filter(user=request.user):
            userInfo = UserInfo.objects.get(user=request.user)
            userInfo.school = schoolName
            userInfo.save()
        else:
            data = {
                'error': "There is now userInfo for the user",
            }
        
    else:
        data = {
            'error': "There was an error posting this request. Please try again.",
        }
        
    
    return HttpResponse(json.dumps(data))



@login_required
def teacherStudent(request):
    if request.method == 'POST':
        teacherStudent = request.POST["teacherStudent"]
        
        data = {
            'success': "success",
        }
        if UserInfo.objects.filter(user=request.user):
            userInfo = UserInfo.objects.get(user=request.user)
            userInfo.teacher_student = teacherStudent
            userInfo.save()
            
        else:
            data = {
                'error': "There is now userInfo for the user",
            }
            
        
        if teacherStudent == 'teacher':
            teacher = True
        else:
            teacher = False
            
        #Get all users Classes
        if ClassUser.objects.filter(user=request.user):
            classUser = ClassUser.objects.get(user=request.user)
            classUser.teacher = teacher
            classUser.save()
        else:
            classUser = ClassUser.objects.create(
                user = request.user,
                teacher = teacher,
            )
        
    else:
        data = {
            'error': "There was an error posting this request. Please try again.",
        }
        
    
    return HttpResponse(json.dumps(data))



@login_required
def profileUpdate(request):
    if request.method == 'POST':
        try:
            title = request.POST["title"]
        except:
            title = 'False'
            
        fullName = request.POST["fullName"]
        
        fullName = fullName.strip(' \t\n\r')
        fullName = fullName.title()
        
        firstName = fullName.split(' ',1)[0]
        try:
            lastName = fullName.split(' ',1)[1]
        except:
            return HttpResponse(json.dumps({'error':'Oops, we need your full name.'}))
        
        try:
            studentID = request.POST["studentID"]
            if ClassUser.objects.filter(user=request.user):
                classUser = ClassUser.objects.get(user=request.user)
                classUser.studentID = studentID
                classUser.save()
        except:
            pass
        
        data = {
            'fullName': fullName,
        }
        if UserInfo.objects.filter(user=request.user):
            userInfo = UserInfo.objects.get(user=request.user)
            if title == 'False':
                userInfo.title = ""
            else:
                userInfo.title = title
                
            request.user.first_name = firstName
            request.user.last_name = lastName
            request.user.save()
            userInfo.save()
        else:
            data = {
                'error': "There is now userInfo for the user",
            }
        
    else:
        data = {
            'error': "There was an error posting this request. Please try again.",
        }
        
    
    return HttpResponse(json.dumps(data))



@login_required
def studentInfoUpdate(request):
    if request.method == 'POST':
        fullName = request.POST["fullName"]
        classUserID = request.POST["classUserID"]
        
        fullName = fullName.strip(' \t\n\r')
        fullName = fullName.title()
        
        firstName = fullName.split(' ',1)[0]
        try:
            lastName = fullName.split(' ',1)[1]
        except:
            return HttpResponse(json.dumps({'error':"Oops, we need the student's full name."}))
        
        try:
            studentID = request.POST["studentID"]
        except:
            studentID = False
        
        
        if ClassUser.objects.filter(id=classUserID):
            classUser = ClassUser.objects.get(id=classUserID)
            classUser.user.first_name = firstName
            classUser.user.last_name = lastName
            classUser.user.save()
            if studentID:
                classUser.studentID = studentID
                classUser.save()
            
            data = {
                'fullName': lastName.title()+", "+firstName.title(),
            }
        else:
            data = {
                'error': "We can't find that student's information.",
            }
        
    else:
        data = {
            'error': "There was an error posting this request. Please try again.",
        }
        
    
    return HttpResponse(json.dumps(data))




@login_required
def lockStudentNames(request):
    if request.method == 'POST':
        classID = request.POST["classID"]
        
        if ClassUser.objects.filter(user=request.user):
            teacher = ClassUser.objects.get(user=request.user)
        if Classroom.objects.filter(id=classID):
            classroom = Classroom.objects.get(id=classID)
            if classroom.classOwnerID != teacher.id:
                return HttpResponse(json.dumps({"error":"You must be the teacher of this classroom."}))
            else:
                if ClassUser.objects.filter(classrooms=classroom, teacher=False):
                    students = ClassUser.objects.filter(classrooms=classroom, teacher=False)
                    if students[0].lockedChanges:
                        students.update(lockedChanges=False)
                        bLocked = False
                    else:
                        students.update(lockedChanges=True)
                        bLocked = True
        
            data = {
                'bLocked': bLocked,
            }
        else:
            data = {
                'error': "We can't find that student's information.",
            }
        
    else:
        data = {
            'error': "There was an error posting this request. Please try again.",
        }
        
    
    return HttpResponse(json.dumps(data))





@login_required
def csvDownload(request):
    if request.method == 'POST':
        projectID =request.POST["projectID"].strip()
        classID =request.POST["classID"].strip()
        
        students = []
        if ClassUser.objects.filter(user=request.user, teacher=True):
            if Project.objects.filter(id=projectID):
                project = Project.objects.get(id=projectID)
                
                if classID == 'allClasses':
                    if Classroom.objects.filter(worksheets=project):
                        classrooms = Classroom.objects.filter(worksheets=project).order_by('id')
                        
                        for classroom in classrooms:
                            if ClassUser.objects.filter(classrooms=classroom, teacher=False):
                                tempStudents = ClassUser.objects.filter(classrooms=classroom, teacher=False).order_by('user__last_name', 'user__first_name')
                                students.extend(tempStudents)
                else:
                    if Classroom.objects.filter(id=classID):
                        classroom = Classroom.objects.get(id=classID)
                        
                        if ClassUser.objects.filter(classrooms=classroom, teacher=False):
                            students = ClassUser.objects.filter(classrooms=classroom, teacher=False).order_by('user__last_name', 'user__first_name')
                        

        args = {
                "students":students,
                "currentProject":project,
            }
        
        return render_to_response('csvDownload.txt', args)
    else:
        return HttpResponse('Sorry, something went wrong.')





@login_required
def googleDriveGradeUpload(request):
    if request.method == 'POST':
        projectID =request.POST["projectID"].strip()
        
        if ClassUser.objects.filter(user=request.user, teacher=True):
            if Project.objects.filter(id=projectID):
                project = Project.objects.get(id=projectID)
            
                if Classroom.objects.filter(worksheets=project):
                    classrooms = Classroom.objects.filter(worksheets=project).order_by('id')
                    
                    row = []
                    for classroom in classrooms:
                        row.append('"'+classroom.name.title()+'"')
                        if ClassUser.objects.filter(classrooms=classroom, teacher=False):
                            students = ClassUser.objects.filter(classrooms=classroom, teacher=False).order_by('user__last_name')
                            row.append('"Students","ID","Average"')
                            for student in students:
                                if MyGrade.objects.filter(project=project, userInfo__user=student.user):
                                    myGrade = MyGrade.objects.get(project=project, userInfo__user=student.user)
                                    if student.studentID:
                                        row.append('"'+ student.user.last_name +', '+ student.user.first_name +'","'+student.studentID+'","{0:.2f}%'.format(round(myGrade.average),2) +'"')
                                    else:
                                        row.append('"'+ student.user.last_name +', '+ student.user.first_name +'","--no id--","{0:.2f}%'.format(round(myGrade.average),2) +'"')
                                else:
                                    row.append('"'+ student.user.last_name +', '+ student.user.first_name +'","*"')
                    
                    FILENAME = makeCSV(request.user, row ,project.title.title()+' grades')
                    
                    #Now upload to google drive
                    storage = Storage(CredentialsModel, 'id', request.user, 'credential')
                    credential = storage.get()
                    
                    if credential is None or credential.invalid == True:
                        #return HttpResponseRedirect("/login/")
                        return render_to_response('google-login-wait.html', {})
                    
                    else:
                        # Path to the file to upload
                        #FILENAME = filePath
                        
                        fdir, fname = os.path.split(FILENAME)
                    
                        http = httplib2.Http()
                        http = credential.authorize(http)
                        drive_service = build("drive", "v2", http=http)
                    
                        # Insert a file
                        media_body = MediaFileUpload(FILENAME, mimetype='text/csv', resumable=True)
                        body = {
                          'title': fname+'(Duck Soup Worksheet)',
                          'description': 'A grade report for '+project.title.title()+' worksheet. Created by Duck Soup Worksheets.',
                          'mimeType': 'text/csv'
                        }
                        
                        file = drive_service.files().insert(body=body, media_body=media_body, convert=True).execute()
                        
                        #log.info(file)
                        os.remove(FILENAME)
                    
                    data = {'link':file['alternateLink']}
                else:
                    data = {'error':"Sorry, we can't find any classes that are assigned this worksheet."}
            else:
                data = {'error':"Sorry, we can't find that worksheet."}
        else:
            data = {'error':'Sorry, you must be a teacher.'}
        
    else:
        data = {
            'error': "There was an error posting this request. Please try again.",
        }
        
    
    return HttpResponse(json.dumps(data))





def makeCSV(user, data ,title):
    baseFilePath = os.path.join(ROOT_PATH,'media', user.first_name+user.last_name+str(user.id), 'temp')
    make_sure_path_exists(baseFilePath)
    
    '''
    #This is how you create new data
    data = ['"cell","cell","cell","cell"','"cell","cell","cell","cell"',....]
    
    '\n'.join(data)
    '''
    #changed the .json to .sst to change it to a format that people would not recognize in their drive
    with open(os.path.join(baseFilePath,title), 'w') as text_file:
        text_file.write('\n'.join(data))
        
    return os.path.join(baseFilePath,title)









































def make_sure_path_exists(path):
    try:
        os.makedirs(path)
    except OSError as exception:
        if exception.errno != errno.EEXIST:
            raise











def test(request):
    return HttpResponse('You are in test in userInfo_profile views.py')

def test_function():
    return 'you got this from test_function inside userInfo_profile views.py'