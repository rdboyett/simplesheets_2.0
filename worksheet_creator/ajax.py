import os
import json

from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

from userInfo_profile.models import UserInfo, MyGrade
from worksheet_creator.models import Project
from classrooms.models import Classroom, ClassUser


@login_required
def checkProjectExists(request):
    if request.method == 'POST':
        originalFileID = request.POST["fileID"]
        
        data = {
            'success': "success",
            'projectExist': "false",
        }
        if UserInfo.objects.filter(user=request.user):
            userInfo = UserInfo.objects.get(user=request.user)
            if Project.objects.filter(originalFileID=originalFileID):
                oldProjects = Project.objects.filter(originalFileID=originalFileID)
                for oldProject in oldProjects:
                    for testUser in oldProject.userinfo_set.all():
                        if userInfo == testUser:
                            data = {
                                'success': "success",
                                'projectExist': "true",
                            }
        
        else:
            data = {
                'error': "There is no input with ID: "+str(inputNumber),
            }
        
    else:
        data = {
            'error': "There was an error posting this request. Please try again.",
        }
        
    
    return HttpResponse(json.dumps(data))



@login_required
def deleteOldProject(request):
    if request.method == 'POST':
        '''
        userInfo_id = request.POST["userInfo_id"]
        originalFileID = request.POST["fileID"]
        
        
        if UserInfo.objects.filter(id=userInfo_id):
            userInfo = UserInfo.objects.get(id=userInfo_id)
            if Project.objects.filter(originalFileID=originalFileID):
                oldProjects = Project.objects.filter(originalFileID=originalFileID)
                for oldProject in oldProjects:
                    for testUser in oldProject.userinfo_set.all():
                        if userInfo == testUser:
                            for image in oldProject.backgroundImages.all():
                                imagePath = image.imagePath
                                
                            a, b = os.path.split(imagePath)
                            fdir, folderName = os.path.split(a)
                            
                            basePath = os.path.join(settings.ROOT_PATH,'media', request.user.first_name+request.user.last_name+str(request.user.id), str(folderName))
                            make_sure_path_exists(basePath)
                            shutil.rmtree(basePath)
                            
                            #build Service
                            service = get_service(request.user)
                            
                            #put the file in trash
                            file = delete_file(service, oldProject.uploadedFileID)
                            
                            oldProject.backgroundImages.all().delete()
                            oldProject.formInputs.all().delete()
                            
                            userInfo.projects.remove(oldProject)
                            oldProject.delete();
                            
                            
                            data = {
                                'success': "success",
                            }
                            
        
        else:
            data = {
                'error': "There is no input with ID: "+str(inputNumber),
            }
        '''
        data = {
            'success': "success",
        }
    else:
        data = {
            'error': "There was an error posting this request. Please try again.",
        }
        
    
    return HttpResponse(json.dumps(data))





@login_required
def assignWorksheets(request):
    if request.method == 'POST':
        projectIDList = request.POST.getlist("projectIDList[]")
        classIDList = request.POST.getlist("classIDList[]")
        
        for classID in classIDList:
            if Classroom.objects.filter(id=classID):
                classroom = Classroom.objects.get(id=classID)
                for worksheetID in projectIDList:
                    if Project.objects.filter(id=worksheetID):
                        worksheet = Project.objects.get(id=worksheetID)
                        classroom.worksheets.add(worksheet)
                        classroom.save()

        data = {
            'success': "success",
        }
    else:
        data = {
            'error': "There was an error posting this request. Please try again.",
        }
        
    
    return HttpResponse(json.dumps(data))






@login_required
def resetNumberRetry(request):
    if request.method == 'POST':
        classUser = ClassUser.objects.get(user=request.user)
        projectID = request.POST["projectID"].strip()
        classID = request.POST["classID"].strip()
        numberRetry = request.POST["numberRetry"].strip()
        studentClassUser_id = request.POST["userID"].strip()
        
        if Classroom.objects.filter(id=classID, classOwnerID=classUser.id) and classUser.teacher:
            #This person has the right to reset the number of tries (they own the class and are a teacher)
            if Project.objects.filter(id=projectID) and ClassUser.objects.filter(id=studentClassUser_id):
                userInfo = UserInfo.objects.get(user=ClassUser.objects.get(id=studentClassUser_id).user)
                currentProject = Project.objects.get(id=projectID)
                if MyGrade.objects.filter(project=currentProject, userInfo=userInfo):
                    myGrades = MyGrade.objects.filter(project=currentProject, userInfo=userInfo)
                    newTimesGraded = int(currentProject.numberOfRetry) - int(numberRetry)
                    for grade in myGrades:
                        grade.timesGraded = newTimesGraded
                        grade.save()
                    
                    data = {'success':'success'}
                    
                else:
                    data = {'error':"Sorry, the student hasn't started on the worksheet yet."}
                    
            
            else:
                data = {'error':"Sorry, we can't find that worksheet or student."}
                
        else:
            data = {'error':"Sorry, you must be the teacher who created this class."}
        
    else:
        data = {
            'error': "There was an error posting this request. Please try again.",
        }
        
    
    return HttpResponse(json.dumps(data))












