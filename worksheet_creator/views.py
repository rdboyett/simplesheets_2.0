import os
ROOT_PATH = os.path.dirname(__file__)

import subprocess
import errno
import json
import logging
import httplib2
import datetime
import shutil
import re


from django.shortcuts import render_to_response, redirect
from django.http import Http404, HttpResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.core.context_processors import csrf

from apiclient.discovery import build
from oauth2client import xsrfutil
from oauth2client.client import flow_from_clientsecrets
from oauth2client.django_orm import Storage

from apiclient.http import MediaFileUpload
from oauth2client.client import OAuth2WebServerFlow

from apiclient import errors

from pyPdf import PdfFileReader, PdfFileWriter
from tempfile import NamedTemporaryFile

import zipfile
import StringIO


try:
    from PIL import Image
except ImportError:
    import Image


from userInfo_profile.models import UserInfo
from classrooms.models import ClassUser, Classroom
from classrooms.views import generateCode
from google_login.models import CredentialsModel
from worksheet_creator.models import Project, BackImage
from google_drive.views import driveUpload, createGoogleShortcut, get_service, checkOrCreateGoogleFolder



@login_required
def startCreate(request, fileId=False):
    if not fileId:
        return redirect("/drive/pickFile/")
    else:
        return render_to_response('building-worksheet-wait.html', {
            "worksheet":True,
            "fileId":fileId,
            
        })

#worksheet/create/0B5JUxbetYkEaeHVKTEw1TFpBelE  (here is good practice link)

@login_required
def create(request):
    if request.method == 'POST':
        fileId = request.POST["fileID"]
            
        if not fileId:
            return HttpResponse(json.dumps({"error":"There was an error creating your worksheet. Please try again."}))
        else:
            storage = Storage(CredentialsModel, 'id', request.user, 'credential')
            credential = storage.get()
    
            userInfo = UserInfo.objects.get(user=request.user)
            
            today = datetime.datetime.now().strftime("%Y%m%d%H%M")
        
    
            if credential is None or credential.invalid == True:
                #return HttpResponseRedirect("/login/")
                return render_to_response('google-login-wait.html', {})
            else:
                http = httplib2.Http()
                http = credential.authorize(http)
                drive_service = build("drive", "v2", http=http)
            
    
            
            if True:#try:
                file = drive_service.files().get(fileId=fileId).execute()
                
                
                #get the download url for the file
                try:
                    download_url = file['exportLinks']['application/pdf']
                except Exception:
                    if file['mimeType'] == "application/pdf":
                        download_url = file.get('downloadUrl')
                    else:
                        return HttpResponse(json.dumps({'error':"Sorry, we can't convert that file into a pdf.  Try converting it to a google doc or printing it as a pdf first."}))
            
                
                if download_url:
                    #Download the file's content and store as a PDF file-------------------------------------------------
                  resp, content = drive_service._http.request(download_url)
                  if resp.status == 200:
                    rawTitle = file['title']
                    if len(rawTitle)>90:
                        rawTitle = rawTitle[:90]
                    title = re.sub(r'[^\w]', '', rawTitle)
                    title = title.replace(" ", "")
                    if len(title) > 10:
                        title = title[:10]
                    baseFilePath = os.path.join(ROOT_PATH,'media', request.user.first_name+request.user.last_name+str(request.user.id), str(title[:5]+str(fileId[:5])))
                    duckThumbPath = os.path.join(ROOT_PATH, 'duckThumb')
                    make_sure_path_exists(duckThumbPath)
                    make_sure_path_exists(baseFilePath)
                    
                    pdfPath = os.path.join(baseFilePath,title + ".pdf")
                    f = open(pdfPath, 'wb')
                    f.write(content)
                    f.close()
                    
                    try:
                        #count the number of pages and delete if too many:---------------------------------------------------
                        pdfFile = open(pdfPath, "rb")
                        reader = PdfFileReader(pdfFile)
                        counter = 0
                        number_of_pages = reader.getNumPages()
                        for page_num in xrange(number_of_pages):
                            counter += 1
                        if counter > 5:
                            bTooManyPages = True
                            pdfFile.close()
                            os.remove(pdfPath)
                        else:
                            bTooManyPages = False
                    except:
                        return HttpResponse(json.dumps({"error":"You can only use 5 pages or less.  If this keeps happening, try printing the document as a pdf and reload the new document."}))
                    
                    
                    
                    if not bTooManyPages:
                        try:
                            #Convert pages to images:-------------------------------------------------------------------------
                            bItConverted = covertPDFtoImage(pdfPath, os.path.join(baseFilePath, title+ '.jpg'))
                            if bItConverted:
                                pdfFile.close()
                                os.remove(pdfPath)
                                
                            
                            #store file paths----------------------------------------------------------------------------------
                            filenames = []
                            if number_of_pages > 1:
                                for pageNumber in range(0,counter):
                                    filenames.append(os.path.join(baseFilePath,title + '-' + str(pageNumber) + '.jpg'))
                            else:
                                filenames.append(os.path.join(baseFilePath,title + '.jpg'))
                                
                                
                                
                            if Project.objects.filter(title__istartswith=rawTitle):
                                nameCount = Project.objects.filter(title__istartswith=rawTitle).count()
                                nameCount+=1
                                nameNumber=" ("+str(nameCount)+")"
                            else:
                                nameNumber=""
                                
                            #create a project-----------------------------------------------------------------------------------
                            newProject = Project.objects.create(
                                title = rawTitle+str(nameNumber),
                                originalFileID = fileId,
                                ownerID = request.user.id,
                            )
                            userInfo.projects.add(newProject)
                            
                            
                            #create background images for the project----------------------------------------------------------
                            pageNum = 0
                            for filename in filenames:
                                pageNum += 1
                                fileComponentsList = filename.split(os.sep)
                                newList = []
                                listLen = int(len(fileComponentsList))
                                for number in range((listLen-4),listLen):
                                    newList.append(fileComponentsList[number])
                                lastFileName = os.path.join('/',*newList)
                                newFilename = display_path(lastFileName)
                                
                                
                                newBackImage = BackImage.objects.create(
                                    imagePath = newFilename,
                                    pageNumber = pageNum
                                )
                                newProject.backgroundImages.add(newBackImage)
                            
                            
                            #Create a json file to store all file information---------------------------------------------------
                            projectData = {
                                'user_id':request.user.id,
                                'userInfo_id':userInfo.id,
                                'project_id':newProject.id,
                            }
                            jsonFilePath = makeJsonFile(request.user, projectData, title, baseFilePath)
                            #filenames.append(jsonFilePath)
                            
                            if ClassUser.objects.filter(user=request.user):
                                classUser = ClassUser.objects.get(user=request.user)
                                if classUser.googleFolderID:
                                    checkFolderID = checkOrCreateGoogleFolder(request.user, classUser.googleFolderID, False, False)
                                    if not classUser.googleFolderID == checkFolderID:
                                        classUser.googleFolderID = checkFolderID
                                        classUser.save()
                                else:
                                    classUser.googleFolderID = checkOrCreateGoogleFolder(request.user, False, False, False)
                                    classUser.save()
                                    
                            uploadedFileID = driveUpload(request.user, os.path.join(baseFilePath,title), os.path.join(duckThumbPath,'icon_600.png'), json.dumps(projectData), newProject.title.title(), classUser.googleFolderID)
                            if uploadedFileID:
                                os.remove(os.path.join(baseFilePath,title))
                                newProject.uploadedFileID = uploadedFileID
                                
                            newProject.save()
                        except:
                            return HttpResponse(json.dumps({"error":"This is so embarrassing. Something went wrong, that's all we know."}))
                                
                            
                        try:
                            size = 200, 260
                            thumbPath = os.path.join(baseFilePath,"thumbnail.png")
                            im = Image.open(filenames[0])
                            im.thumbnail(size)
                            im.save(thumbPath, "PNG")
                            #Now trim the thumbpath down for a url link to the image
                            newThumbPath = thumbPath.split('worksheet_creator')
                            
                            newProject.thumb = newThumbPath[1]
                            newProject.save()
                        except:
                            data = {
                                'success': "success",
                                'projectID':newProject.id,
                            }
                            return HttpResponse(json.dumps(data))
                        
                        
                    else:
                        return HttpResponse(json.dumps({"error":"Sorry you are limited to 5 pages for your worksheet."}))
                  else:
                    content = None
                else:
                  # The file doesn't have any content stored on Drive.
                  content = None
                
                
                        
                
                 
                title = file['title']
                mimeType = file['mimeType']
                
                loadFirstPage = os.path.join('nextPage',str(newProject.id),'1')
                loadFirstPage = '/'+display_path(loadFirstPage)+'/'
                
                data = {
                    'success': "success",
                    'projectID':newProject.id,
                }
            
            else:#except errors.HttpError, error:
              data = {
                    'error': "There was an error creating your worksheet. Please try again.",
                }
            
        
        
        
    else:
        data = {
            'error': "There was an error creating your worksheet. Please try again.",
        }
        
    
    return HttpResponse(json.dumps(data))
        
        
        
        
        
        
        
        
        
        
@login_required
def createFromPDF(request):
    if request.method == 'POST':
        pdfFile = request.FILES["uploadFile"]
        userInfo = UserInfo.objects.get(user=request.user)
        
        rawTitle = pdfFile.name.split('.')[0]
        title = re.sub(r'[^\w]', '', rawTitle)
        title = title.replace(" ", "")
        baseFilePath = os.path.join(ROOT_PATH,'media', request.user.first_name+request.user.last_name+str(request.user.id), str(title[:5]+str(generateCode())))
        make_sure_path_exists(baseFilePath)
        
        
        pdfPath = os.path.join(baseFilePath,title + ".pdf")
        f = open(pdfPath, 'wb')
        f.write(pdfFile.read())
        f.close()
        
        
        #count the number of pages and delete if too many:---------------------------------------------------
        pdfFile = open(pdfPath, "rb")
        try:
            reader = PdfFileReader(pdfFile)
        except:
            return HttpResponse(json.dumps({"error":"Sorry, there was a problem with the pdf file."}))
        
        counter = 0
        number_of_pages = reader.getNumPages()
        for page_num in xrange(number_of_pages):
            counter += 1
        if counter > 5:
            bTooManyPages = True
            pdfFile.close()
            os.remove(pdfPath)
        else:
            bTooManyPages = False
                    
                    
                    
        if not bTooManyPages:
            #Convert pages to images:-------------------------------------------------------------------------
            bItConverted = covertPDFtoImage(pdfPath, os.path.join(baseFilePath, title+ '.jpg'))
            if bItConverted:
                pdfFile.close()
                os.remove(pdfPath)
                            
                        
            #store file paths----------------------------------------------------------------------------------
            filenames = []
            if number_of_pages > 1:
                for pageNumber in range(0,counter):
                    filenames.append(os.path.join(baseFilePath,title + '-' + str(pageNumber) + '.jpg'))
            else:
                filenames.append(os.path.join(baseFilePath,title + '.jpg'))
                            
                            
                            
            if Project.objects.filter(title__istartswith=rawTitle):
                nameCount = Project.objects.filter(title__istartswith=rawTitle).count()
                nameCount+=1
                nameNumber=" ("+str(nameCount)+")"
            else:
                nameNumber=""
                            
            #create a project-----------------------------------------------------------------------------------
            newProject = Project.objects.create(
                title = rawTitle+str(nameNumber),
                ownerID = request.user.id,
            )
            userInfo.projects.add(newProject)
                        
                        
            #create background images for the project----------------------------------------------------------
            pageNum = 0
            for filename in filenames:
                pageNum += 1
                fileComponentsList = filename.split(os.sep)
                newList = []
                listLen = int(len(fileComponentsList))
                for number in range((listLen-4),listLen):
                    newList.append(fileComponentsList[number])
                lastFileName = os.path.join('/',*newList)
                newFilename = display_path(lastFileName)
                            
                            
                newBackImage = BackImage.objects.create(
                    imagePath = newFilename,
                    pageNumber = pageNum
                )
                newProject.backgroundImages.add(newBackImage)
                        
                        
            size = 200, 260
            thumbPath = os.path.join(baseFilePath,"thumbnail.png")
            im = Image.open(filenames[0])
            im.thumbnail(size)
            im.save(thumbPath, "PNG")
            #Now trim the thumbpath down for a url link to the image
            newThumbPath = thumbPath.split('worksheet_creator')
                        
            newProject.thumb = newThumbPath[1]
            newProject.save()
                        
            data = {
                'success': "success",
                'projectID':newProject.id,
            }
            return HttpResponse(json.dumps(data))
                        
        else:
            return HttpResponse(json.dumps({"error":"Sorry you are limited to 5 pages for your worksheet."}))
        
    else:
        data = {
            'error': "There was an error creating your worksheet. Please try again.",
        }
        
    
    
    return HttpResponse(json.dumps(data))
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

def openGoogleFile(request):
    if request.method == 'GET':
        idList = json.loads(request.GET["state"])['ids']
        action = json.loads(request.GET["state"])['action']
        googleUserID = json.loads(request.GET["state"])['userId']
        
        bUserIn = False
        #Check if user is logged in already
        if request.user.is_authenticated():
            bUserIn = True
        else:
        #Check if user has session['user_id']
            if 'user_id' in request.session:
                user_id = request.session['user_id']
                if User.objects.filter(id=user_id):
                    user = User.objects.get(id=user_id)
                    user.backend = 'django.contrib.auth.backends.ModelBackend'
                    login(request, user)
                    request.session.set_expiry(604800)  #Time is in Seconds, this equals 7 days
                    bUserIn = True
            
        if not bUserIn:
            args = {}
            args.update(csrf(request))
            #redirect to user login page
            return render_to_response('google_login/login.html', args)
        else:
            service = get_service(request.user)
            
            try:
                file = service.properties().get(fileId=idList[0], propertyKey='duckSoupVariables', visibility='PRIVATE').execute()
                duckSoupVariables = json.loads(file['value'])
                userID = duckSoupVariables["user_id"]
                userInfoID = duckSoupVariables["userInfo_id"]
                projectID = duckSoupVariables["project_id"]
                
                error = False
                #Check if user is a student (if so, get the class that the student belongs to that contains that project and redirect)
                #if user is a teacher check if they own the worksheet. if now redirect to worksheet copy
                if ClassUser.objects.filter(user=request.user):
                    classUser = ClassUser.objects.get(user=request.user)
                    if classUser.teacher:
                        #this is a teacher
                        if Project.objects.filter(id=projectID):
                            project = Project.objects.get(id=projectID)
                            if project.ownerID == request.user.id:
                                return redirect('worksheet_project.views.showNextPage', projectID=projectID, pageNumber=1)
                            else:
                                #redirect to copy worksheet
                                pass
                        else:
                            error = "We can't find that worksheet."
                    else:
                        #this is a student
                        if Classroom.objects.filter(classuser=classUser, worksheets__id=projectID):
                            classroom = Classroom.objects.get(classuser=classUser, worksheets__id=projectID)
                            return redirect('worksheet_project.views.showNextPage', projectID=projectID, pageNumber=1, classID=classroom.id)
                        else:
                            error = "Sorry, your teacher has not assigned this to your class."
                else:
                    error = "there is no classUser"
                    
                if error:
                    request.session['error'] = error
                    return redirect("google_login.views.index")
                else:
                    return HttpResponse(userID)
              
              
              
            except errors.HttpError, error:
                #return error
                
                #Now assume that the user wants to create a worksheet with this file
                try:
                    return redirect("worksheet_creator.views.startCreate", fileId=idList[0])
                
                except:
                    request.session['error'] = "Sorry, we couldn't get the the worksheet info from your google drive."
                    return redirect("google_login.views.index")
    return HttpResponse(googleUserID)
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        



#---------------------------------- Functions -------------------------------------------

def make_sure_path_exists(path):
    try:
        os.makedirs(path)
    except OSError as exception:
        if exception.errno != errno.EEXIST:
            raise



def covertPDFtoImage(input, output, quality=None, density=None):
    params = []
    #params += ["-unsharp", "0x0.4+0.6+0.008"]
    params += ["-density", str(250)]
    subprocess.check_call(["convert"] + params + [input] + [output], 
                                    shell=False)
    
    return True



def display_path(path):
    return path.replace("\\", "/")



def makeJsonFile(user, data ,title, basePath):
    #basePath = os.path.join(settings.ROOT_PATH,'media', user.first_name+user.last_name+str(user.id))
    make_sure_path_exists(basePath)
    
    '''
    #This is how you create new data
    data = {
        'userID': '1234',
        'ProjectID': '1234',
    }
    '''
    #changed the .json to .sst to change it to a format that people would not recognize in their drive
    with open(os.path.join(basePath,title), 'w') as json_file:
        json.dump(data, json_file)
        
    return os.path.join(basePath,title)





















