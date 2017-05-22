import os
ROOT_PATH = os.path.dirname(__file__)

import subprocess
import errno
import json
import logging
import httplib2
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

import PIL
from PIL import ImageFont
from PIL import Image
from PIL import ImageDraw

try:
    from PIL import Image
except ImportError:
    import Image


import logging
log = logging.getLogger(__name__)

from userInfo_profile.models import UserInfo, MyAnswer
from classrooms.models import ClassUser, Classroom
from classrooms.views import generateCode
from google_login.models import CredentialsModel
from worksheet_creator.models import Project, BackImage
from google_drive.views import driveUpload, createGoogleShortcut, get_service, checkOrCreateGoogleFolder
from worksheet_project.views import checkPaidUp
from django.conf import settings
from worksheet_creator.settings import DOMAIN
from payment_tracker.models import PaymentUser



@login_required
def startCreate(request, fileId=False):
    if not fileId:
        return redirect("/drive/pickFile/")
    else:
        if settings.PAYMENT_TRACKER_ON:
            bPaidUp = checkPaidUp(request.user)
        else:
            bPaidUp = True
            
        if not bPaidUp:
            #Check to see if you have used your 5 free worksheets
            #if this is your 6th worksheet then lock all your other worksheets and allow to create 1 more
            if PaymentUser.objects.filter(user=request.user):
                payUser = PaymentUser.objects.get(user=request.user)
                if payUser.numberOfProjects:
                    if payUser.numberOfProjects > 5:
                        if payUser.lastProjectDate:
                            today = datetime.datetime.now(utc)
                            timediff = today - payUser.lastProjectDate
                            if timediff.days > 30:
                                bPaidUp = True
                        else:
                            bPaidUp = True
                    else:
                        bPaidUp = True
                else:
                    bPaidUp = True
            else:
                PaymentUser.objects.create(user=request.user)
                bPaidUp = True
            
            
            
        return render_to_response('building-worksheet-wait.html', {
            "worksheet":True,
            "fileId":fileId,
            "bPaidUp":bPaidUp,
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
                return HttpResponse(json.dumps({'redirect':'login'}))
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
                    rawTitle = rawTitle.replace(":", "-")
                    if len(rawTitle)>90:
                        rawTitle = rawTitle[:90]
                    title = re.sub(r'[^\w]', '', rawTitle)
                    title = title.replace(" ", "")
                    if len(title) > 10:
                        title = title[:10]
                    baseFilePath = os.path.join(settings.MEDIA_ROOT, request.user.first_name+request.user.last_name+str(request.user.id), str(title+str(fileId[-5:])))
                    duckThumbPath = os.path.join(ROOT_PATH, 'duckThumb')
                    make_sure_path_exists(duckThumbPath)
                    make_sure_path_exists(baseFilePath)
                    
                    pdfPath = os.path.join(baseFilePath,title + ".pdf")
                    f = open(pdfPath, 'wb')
                    f.write(content)
                    f.close()
                    '''
                    if True:
                        #count the number of pages and delete if too many:---------------------------------------------------
                        pdfFile = open(pdfPath, "rb")
                        
                        
                        if True:
                            reader = PdfFileReader(pdfFile)
                        else:
                            return HttpResponse(json.dumps({"error":"Sorry, there was a problem with the pdf file."}))
        
                        
                        reader = PdfFileReader(pdfFile)
                        counter = 0
                        number_of_pages = reader.getNumPages()
                        for page_num in xrange(number_of_pages):
                            counter += 1
                        if counter > 15 and DOMAIN=='ducksoup.us':
                            bTooManyPages = True
                            pdfFile.close()
                            os.remove(pdfPath)
                        else:
                            bTooManyPages = False
                    else:
                        return HttpResponse(json.dumps({"error":"You can only use 15 pages or less.  If this keeps happening, try printing the document as a pdf and reload the new document."}))
                    '''
                    
                    
                    if True:
                        #count the number of pages and delete if too many:---------------------------------------------------
                        counter = 0
                                    
                        pdfFile = open(pdfPath, "rb")
                                    
                        try:
                            reader = PdfFileReader(pdfFile)
                            number_of_pages = reader.getNumPages()
                            for page_num in xrange(number_of_pages):
                                counter += 1
                        except:
                            rxcountpages = re.compile(r"/Type\s*/Page([^s]|$)", re.MULTILINE|re.DOTALL)
                            pages = open(pdfPath,"rb").read()
                            counter =  len(rxcountpages.findall(pages))
                            number_of_pages = counter
                            log.info('number of pages: '+str(number_of_pages))
                        
                        if counter > 15 and DOMAIN=='ducksoup.us':
                            bTooManyPages = True
                            pdfFile.close()
                            os.remove(pdfPath)
                        else:
                            bTooManyPages = False
                    else:
                        return HttpResponse(json.dumps({"error":"You can only use 15 pages or less.  If this keeps happening, try printing the document as a pdf and reload the new document."}))

                    if not bTooManyPages:
                        if True:#try:
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
                        else: #except:
                            return HttpResponse(json.dumps({"error":"This is so embarrassing. Something went wrong, that's all we know."}))
                                
                            
                        if True: #try
                            size = 200, 260
                            thumbPath = os.path.join(baseFilePath,"thumbnail.png")
                            im = Image.open(filenames[0])
                            im.thumbnail(size)
                            im.save(thumbPath, "PNG")
                            #Now trim the thumbpath down for a url link to the image
                            thumbPath = thumbPath.replace('qa_media', 'media')
                            newThumbPath = thumbPath.split('media')
                            edited_path = os.path.join('media', newThumbPath[1])
                            newProject.thumb = edited_path
                            newProject.save()
                        else:
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
                
                if PaymentUser.objects.filter(user=request.user):
                    payUser = PaymentUser.objects.get(user=request.user)
                    if payUser.numberOfProjects:
                        payUser.numberOfProjects += 1
                    else:
                        payUser.numberOfProjects = 1
                    
                    payUser.lastProjectDate = datetime.datetime.now()
                    payUser.save()
                else:
                    payUser = PaymentUser.objects.create(
                        user=request.user,
                        numberOfProjects = 1,
                        lastProjectDate = datetime.datetime.now(),
                    )
                
                
                if settings.PAYMENT_TRACKER_ON:
                    bPaidUp = checkPaidUp(request.user)
                else:
                    bPaidUp = True
                    
                if not bPaidUp:
                    #if payUser.numberOfProjects is > 5 lock all other worksheets
                    if payUser.numberOfProjects > 5:
                        if userInfo.projects.all().exclude(id=newProject.id):
                            allOldProjects = userInfo.projects.all().exclude(id=newProject.id)
                            for oldProject in allOldProjects:
                                oldProject.status = 'locked'
                                oldProject.save()
                        
                
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
        
        
        if settings.PAYMENT_TRACKER_ON:
            bPaidUp = checkPaidUp(request.user)
        else:
            bPaidUp = True
            
        if not bPaidUp:
            #Check to see if you have used your 5 free worksheets
            #if this is your 6th worksheet then lock all your other worksheets and allow to create 1 more
            if PaymentUser.objects.filter(user=request.user):
                payUser = PaymentUser.objects.get(user=request.user)
                if payUser.numberOfProjects:
                    if payUser.numberOfProjects > 5:
                        if payUser.lastProjectDate:
                            today = datetime.datetime.now(utc)
                            timediff = today - payUser.lastProjectDate
                            if timediff.days > 30:
                                bPaidUp = True
                        else:
                            bPaidUp = True
                    else:
                        bPaidUp = True
                else:
                    bPaidUp = True
            else:
                PaymentUser.objects.create(user=request.user)
                bPaidUp = True
            
            if not bPaidUp:
                return HttpResponse(json.dumps({"error":"Sorry, free accounts can only have 5 free eSheets and one free eSheet a month."}))
        
        
        rawTitle = pdfFile.name.split('.')[0]
        title = re.sub(r'[^\w]', '', rawTitle)
        title = title.replace(" ", "")
        baseFilePath = os.path.join(settings.MEDIA_ROOT, request.user.first_name+request.user.last_name+str(request.user.id), str(title[:5]+str(generateCode())))
        make_sure_path_exists(baseFilePath)
        
        
        pdfPath = os.path.join(baseFilePath,title + ".pdf")
        f = open(pdfPath, 'wb')
        f.write(pdfFile.read())
        f.close()
        
        
        #count the number of pages and delete if too many:---------------------------------------------------
        if True:
            #count the number of pages and delete if too many:---------------------------------------------------
            counter = 0
                        
            pdfFile = open(pdfPath, "rb")
                        
            try:
                reader = PdfFileReader(pdfFile)
                number_of_pages = reader.getNumPages()
                for page_num in xrange(number_of_pages):
                    counter += 1
            except:
                rxcountpages = re.compile(r"/Type\s*/Page([^s]|$)", re.MULTILINE|re.DOTALL)
                pages = file(pdfPath,"rb").read()
                counter =  len(rxcountpages.findall(pages))
                number_of_pages = counter
                log.info('number of pages: '+str(number_of_pages))
            
            if counter > 15 and DOMAIN=='ducksoup.us':
                bTooManyPages = True
                pdfFile.close()
                os.remove(pdfPath)
            else:
                bTooManyPages = False
        else:
            return HttpResponse(json.dumps({"error":"You can only use 15 pages or less.  If this keeps happening, try printing the document as a pdf and reload the new document."}))
                 
        '''
        pdfFile = open(pdfPath, "rb")
        try:
            reader = PdfFileReader(pdfFile)
        except:
            return HttpResponse(json.dumps({"error":"Sorry, there was a problem with the pdf file."}))
        
        counter = 0
        number_of_pages = reader.getNumPages()
        for page_num in xrange(number_of_pages):
            counter += 1
        if counter > 15 and DOMAIN=='ducksoup.us':
            bTooManyPages = True
            pdfFile.close()
            os.remove(pdfPath)
        else:
            bTooManyPages = False
        '''
                    
                    
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
            
            
            
            
            if PaymentUser.objects.filter(user=request.user):
                payUser = PaymentUser.objects.get(user=request.user)
                if payUser.numberOfProjects:
                    payUser.numberOfProjects += 1
                else:
                    payUser.numberOfProjects = 1
                    
                payUser.lastProjectDate = datetime.datetime.now()
                payUser.save()
            else:
                payUser = PaymentUser.objects.create(
                    user=request.user,
                    numberOfProjects = 1,
                    lastProjectDate = datetime.datetime.now(),
                )
                
                
            if settings.PAYMENT_TRACKER_ON:
                bPaidUp = checkPaidUp(request.user)
            else:
                bPaidUp = True
                    
            if not bPaidUp:
                #if payUser.numberOfProjects is > 5 lock all other worksheets
                if payUser.numberOfProjects > 5:
                    if userInfo.projects.all().exclude(id=newProject.id):
                        allOldProjects = userInfo.projects.all().exclude(id=newProject.id)
                        for oldProject in allOldProjects:
                            oldProject.status = 'locked'
                            oldProject.save()
                        
            
            
            
                        
            data = {
                'success': "success",
                'projectID':newProject.id,
            }
            return HttpResponse(json.dumps(data))
                        
        else:
            return HttpResponse(json.dumps({"error":"Sorry you are limited to 15 pages for your worksheet."}))
        
    else:
        data = {
            'error': "There was an error creating your worksheet. Please try again.",
        }
        
    
    
    return HttpResponse(json.dumps(data))
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

@login_required
def openGoogleFile(request):
    if request.method == 'GET':
        if 'ids' in json.loads(request.GET["state"]):
            idList = json.loads(request.GET["state"])['ids']
        else:
            idList = json.loads(request.GET["state"])['exportIds']
            
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
        
        
        
        
        
        
import textwrap

@login_required
def printStudentWork(request):
    if request.method == 'POST':
        project_id = request.POST["project_id"].strip()
                
                
        if Project.objects.filter(id=project_id):
            project = Project.objects.get(id=project_id)
            
            if project.backgroundImages.all():
                backgroundImages = project.backgroundImages.all()
                for backgroundImage in backgroundImages:
                    filePathList = backgroundImage.imagePath[1:].split('/')
                    baseImagePath = os.path.join(ROOT_PATH, *filePathList)
                    
                    baseFolderPath, imageFile = os.path.split(baseImagePath)
                                
                    newImagePath = os.path.join(baseFolderPath,"copy"+ str(imageFile.split('.')[0])+".png")
                    
                    
                    if ClassUser.objects.filter(user=request.user, teacher=True): #check that this is a teacher that is requesting
                        #Get all the classrooms that have this worksheet
                        if Classroom.objects.filter(worksheets=project):
                            allClasses = Classroom.objects.filter(worksheets=project)
                            if ClassUser.objects.filter(classrooms=allClasses, teacher=False):
                                allUsers = [x.user for x in ClassUser.objects.filter(classrooms=allClasses, teacher=False)]
                                if UserInfo.objects.filter(user__in=allUsers):
                                    allUserInfos = UserInfo.objects.filter(user__in=allUsers)
                                    
                                    
                                    for userInfo in allUserInfos:
                                        if MyAnswer.objects.filter(project=project, userInfo=userInfo, answer__pageNumber=backgroundImage.pageNumber):
                                            myAnswers = MyAnswer.objects.filter(project=project, userInfo=userInfo, answer__pageNumber=backgroundImage.pageNumber)
                                            
                                            #opens an image:
                                            im = Image.open(baseImagePath)
                                            width,height=im.size
                                            #creates a new empty image, RGB mode, and size 400 by 400.
                                            new_im = Image.new('RGB', (width,height))
                                            
                                            new_im.paste(im)
                    
                    
                                    
                                            for myAnswer in myAnswers:
                                                if myAnswer.answer.inputType == 'drawing' or myAnswer.answer.inputType == 'work':
                                                    workImagePathList = myAnswer.workImagePath[1:].split('/')
                                                    workImagePath = os.path.join(ROOT_PATH, *workImagePathList)
                                                    img = Image.open(workImagePath)
                                                    answerWidth = float(myAnswer.answer.width)*float(width)*.01
                                                    answerHeight = float(myAnswer.answer.height)*float(height)*.01
                                                    left = (float(myAnswer.answer.left)*float(width)*.01)
                                                    top = (float(myAnswer.answer.top)*float(height)*.01)
                                                    img.thumbnail((int(answerWidth),int(answerHeight)),Image.ANTIALIAS)
                                                else:
                                                    answerText = myAnswer.myAnswer
                                                    answerWidth = float(myAnswer.answer.width)*float(width)*.01
                                                    answerHeight = float(myAnswer.answer.height)*float(height)*.01
                                                    left = (float(myAnswer.answer.left)*float(width)*.01)
                                                    top = (float(myAnswer.answer.top)*float(height)*.01)
                                                    if myAnswer.bCorrect:
                                                        backColor = (155,252,159, 0)
                                                    else:
                                                        backColor = (252,155,155, 0)
                                                    
                                                    para = textwrap.wrap(answerText, width=int(answerWidth*.066))
                                                    #Create the test from the students answer and get the position to paste it
                                                    fonts_path = os.path.join(ROOT_PATH, 'fonts')
                                                    font = ImageFont.truetype(os.path.join(fonts_path, "arial.ttf"), 35)
                                                    img=Image.new("RGBA", (int(answerWidth),int(answerHeight)),backColor)
                                                    draw = ImageDraw.Draw(img)
                                                    #draw.text((0, 0),answerText,(0,0,0),font=font)
                                                    
                                                    current_h, pad = 25, 10
                                                    for line in para:
                                                        w, h = draw.textsize(line, font=font)
                                                        draw.text(((answerWidth - w) / 2, current_h), line, (0,0,0), font=font)
                                                        current_h += h + pad
                                                    
                                                    
                                                    draw = ImageDraw.Draw(img)
                                                
                                                
                                                
                                                new_im.paste(img, (int(left),int(top)))
                                    
                                    
                                            new_im.save(newImagePath, "PNG")
                                    
                                else:
                                    return HttpResponse(json.dumps({'error':"Sorry, there are no students in this class."}))
                            else:
                                return HttpResponse(json.dumps({'error':"Sorry, there are no students in this class."}))
                            
                        else:
                            return HttpResponse(json.dumps({'error':"Sorry, this e-sheet is not assigned to any classes."}))
                    else:
                        return HttpResponse(json.dumps({'error':"Sorry, you must be a teacher."}))
                    
                    
                    
            
            '''
            pdf = pdfkit.from_url('http://amazon.com', False)
            
            baseFilePath = os.path.join(settings.MEDIA_ROOT, request.user.first_name+request.user.last_name+str(request.user.id))
            make_sure_path_exists(baseFilePath)
                        
            pdfPath = os.path.join(baseFilePath,"temp.pdf")
                
            with open(pdfPath, 'w') as f:
                f.write(pdf)
            '''
            
            '''
            args = {
                'newProject':project,
                'pageNumber':1,
            }
            worksheet = render_to_string('google_drive/worksheet.html', args)
            
            baseFilePath = os.path.join(settings.MEDIA_ROOT, request.user.first_name+request.user.last_name+str(request.user.id))
            make_sure_path_exists(baseFilePath)
                        
            #htmlPath = os.path.join(baseFilePath,"worksheet.html")
            pdfPath = os.path.join(baseFilePath,"temp.pdf")
            pdf = pdfkit.from_string(worksheet, False)
            
            with open(pdfPath, 'w') as f:
                f.write(pdf)
            '''
            
            
            data = {'success':'success'}
        
        
        
    else:
        data = {
            'error': "There was an error posting this request. Please try again.",
        }
            
    return HttpResponse(json.dumps(data))



    
    
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        



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
    subprocess.check_call(["convert"] + params + [input] + [output], shell=False)
    
    return True



def display_path(path):
    path = path.replace("qa_media", "media")
    return path.replace("\\", "/")



def makeJsonFile(user, data ,title, basePath):
    #basePath = os.path.join(settings.MEDIA_ROOT, user.first_name+user.last_name+str(user.id))
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





















