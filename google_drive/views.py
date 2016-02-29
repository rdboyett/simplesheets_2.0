import os
ROOT_PATH = os.path.dirname(__file__)
import logging
import httplib2
from datetime import date
import datetime
import base64
import json


from django.shortcuts import render_to_response, redirect, render
from django.template.loader import render_to_string
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.core.context_processors import csrf


from apiclient.discovery import build
from oauth2client.django_orm import Storage
from apiclient.http import MediaFileUpload
from apiclient import errors


from google_login.models import CredentialsModel, GoogleUserInfo
from userInfo_profile.models import UserInfo
from classrooms.models import ClassUser
from tourBuilder.models import MyTour
from worksheet_creator.models import Project


from worksheet_project import settings
from worksheet_project.views import checkPaidUp



import logging
log = logging.getLogger(__name__)


@login_required
def google_picker(request):
    userInfo = UserInfo.objects.get(user=request.user)
    
    #developerKey = settings.DEVELOPER_KEY
    #clientId = settings.CLIENT_ID
    
    
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
        
    if not classUser.teacher:
        return redirect('worksheet_project.views.classes')
        
    #Get all users Class
    if classUser.classrooms.all():
        allClasses = classUser.classrooms.all().order_by('name')
    else:
        allClasses = False
    
    
    if classUser.teacher and settings.PAYMENT_TRACKER_ON:
        bPaiUP = checkPaidUp(request.user)
    elif settings.PAYMENT_TRACKER_ON:
        bPaiUP = False
    else:
        bPaiUP = True
    
    
    if GoogleUserInfo.objects.filter(user=request.user):
        googleUserInfo = GoogleUserInfo.objects.get(user=request.user)
    else:
        googleUserInfo = False
    
    
    if GoogleUserInfo.objects.filter(user=request.user):
        googleUser = GoogleUserInfo.objects.get(user=request.user)
        today = datetime.date.today()
        try:
            yearAgo = datetime.date(today.year - 1, today.month, today.day)
        except:
            #This is for leap year (Feb 29th does not exist last year)
            yearAgo = datetime.date(today.year - 1, today.month, today.day-2)

        yearAgo = yearAgo.strftime("%Y-%m-%d")+'T12:00:00'
        
        drive_service = get_service(request.user)
        
        pdfFiles = retrieve_all_files(drive_service, "mimeType = 'application/pdf' and lastViewedByMeDate > '"+ yearAgo +"'")
        
        
        docFiles = retrieve_all_files(drive_service, "mimeType = 'application/vnd.google-apps.document' and lastViewedByMeDate > '"+ yearAgo +"'")
        
    else:
        googleUser = False
        docFiles = False
        pdfFiles = False
        
        
    
    if MyTour.objects.filter(name='pic_file', user=request.user):
        myTour = MyTour.objects.get(name='pic_file', user=request.user)
        if myTour.nTimesRan >= myTour.nManditoryRuns:
            myTour = False
    else:
        myTour = MyTour.objects.create(
            user = request.user,
            name = 'pic_file',
            nManditoryRuns = 1,
            nTimesRan = 0,
        )
    
    args = {
              'worksheet':True,
              'userInfo': userInfo,
              "allClasses":allClasses,
              "classUser":classUser,
              "create":True,
              "googleUser":googleUser,
              "googleUserInfo":googleUserInfo,
              "docFiles":docFiles,
              "pdfFiles":pdfFiles,
              "myTour":myTour,
              "tourReset":'pic_file',
              "bPaidUp":bPaiUP,
        }
    args.update(csrf(request))
        
    
    return render_to_response('google_drive/list_files.html', args)



#------------------------------------------------- Misc Functions -----------------------------------------------#

def driveUpload(user, FILENAME, thumbPath, projectData, googleTitle, parentFolderID):
    storage = Storage(CredentialsModel, 'id', user, 'credential')
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
        
        with open(thumbPath, "rb") as image_file:
            imageData = base64.urlsafe_b64encode(image_file.read())
        
    
        # Insert a file
        media_body = MediaFileUpload(FILENAME, mimetype='application/sst', resumable=True)
        body = {
          'title': googleTitle,
          'description': 'Duck Soup Worksheet',
          'mimeType': 'application/sst',
            "thumbnail": {
                    "image": imageData,
                    "mimeType": 'image/png'
            },
            "copyable":True,
            "defaultOpenWithLink": "worksheet_creator.views.openGoogleFile",
        }
        
        if parentFolderID:
            body["parents"] = [{"id":str(parentFolderID)}]
        
        returnedFile = drive_service.files().insert(body=body, media_body=media_body).execute()
        
        log.info(returnedFile)
        
        duckSoupParameters = {
                'key':        'duckSoupVariables',
                'value':      projectData,
                'visibility': 'PRIVATE'
            }
        drive_service.properties().insert(fileId=returnedFile['id'], body=duckSoupParameters).execute()
        
        return returnedFile['id']


def createGoogleShortcut(user, FILENAME, thumbPath, projectData):
    storage = Storage(CredentialsModel, 'id', user, 'credential')
    credential = storage.get()
    
    if credential is None or credential.invalid == True:
        #return HttpResponseRedirect("/login/")
        return render_to_response('google-login-wait.html', {})
    
    else:
        # Path to the file to upload
        #FILENAME = filePath
        
        #fdir, fname = os.path.split(FILENAME)
    
        http = httplib2.Http()
        http = credential.authorize(http)
        drive_service = build("drive", "v2", http=http)
        
        with open(thumbPath, "rb") as image_file:
            imageData = base64.urlsafe_b64encode(image_file.read())
        
        
        body = {
            'title': FILENAME,
            'description': 'Duck Soup Worksheet',
            'mimeType': 'application/vnd.google-apps.drive-sdk',
            "thumbnail": {
                    "image": imageData,
                    "mimeType": 'image/png'
            },
            "copyable":True,
            "defaultOpenWithLink": "worksheet_creator.views.openGoogleFile",
        }
        
        returnedFile = drive_service.files().insert(body=body).execute()
        
        log.info(returnedFile)
        
        duckSoupParameters = {
                'key':        'duckSoupVariables',
                'value':      projectData,
                'visibility': 'PRIVATE'
            }
        drive_service.properties().insert(fileId=returnedFile['id'], body=duckSoupParameters).execute()
        
        return returnedFile['id']
        
        


def delete_file(service, file_id):
  """Permanently delete a file, skipping the trash.

  Args:
    service: Drive API service instance.
    file_id: ID of the file to delete.
  """
  try:
    return service.files().delete(fileId=file_id).execute()
  except errors.HttpError, error:
    #return error
    return False
    
    
    
def trash_file(service, file_id):
  """Move a file to the trash.

  Args:
    service: Drive API service instance.
    file_id: ID of the file to trash.

  Returns:
    The updated file if successful, None otherwise.
  """
  try:
    return service.files().trash(fileId=file_id).execute()
  except errors.HttpError, error:
    #return error
    return False
  
    
    
def get_file(service, file_id):
  """Print a file's metadata.

  Args:
    service: Drive API service instance.
    file_id: ID of the file to print metadata for.
  """
  try:
    file = service.files().get(fileId=file_id).execute()
    '''
    print 'Title: %s' % file['title']
    print 'MIME type: %s' % file['mimeType']
    '''
    return file
  except errors.HttpError, error:
    #return error
    return False


def download_file(service, drive_file):
  """Download a file's content.

  Args:
    service: Drive API service instance.
    drive_file: Drive File instance.

  Returns:
    File's content if successful, None otherwise.
  """
  download_url = drive_file.get('downloadUrl')
  if download_url:
    resp, content = service._http.request(download_url)
    if resp.status == 200:
      #print 'Status: %s' % resp
      return content
    else:
      #print 'An error occurred: %s' % resp
      return None
  else:
    # The file doesn't have any content stored on Drive.
    return None
    
    
    
def restore_file_from_trash(service, file_id):
  """Restore a file from the trash.

  Args:
    service: Drive API service instance.
    file_id: ID of the file to restore.

  Returns:
    The updated file if successful, None otherwise.
  """
  try:
    return service.files().untrash(fileId=file_id).execute()
  except errors.HttpError, error:
    #print 'An error occurred: %s' % error
    return None


    
def update_file(service, file_id, file_with_update, new_revision):
  """Update an existing file's metadata and content.

  Args:
    service: Drive API service instance.
    file_id: ID of the file to update.
    new_title: New title for the file.
    new_description: New description for the file.
    new_mime_type: New MIME type for the file.
    file_with_update: Filename of the new content to upload.
    new_revision: Whether or not to create a new revision for this file.
  Returns:
    Updated file metadata if successful, None otherwise.
  """
  try:
    # First retrieve the file from the API.
    file = service.files().get(fileId=file_id).execute()
    
    '''
    # File's new metadata.
    file['title'] = new_title
    file['description'] = new_description
    file['mimeType'] = new_mime_type
    '''

    # File's new content.
    media_body = MediaFileUpload(
        file_with_update, mimetype=new_mime_type, resumable=True)

    # Send the request to the API.
    updated_file = service.files().update(
        fileId=file_id,
        body=file,
        newRevision=new_revision,
        media_body=media_body).execute()
    return updated_file
  except errors.HttpError, error:
    print 'An error occurred: %s' % error
    return None
    
    
    
def rename_google_file(service, file_id, new_title):
  """Update an existing file's metadata and content.

  Args:
    service: Drive API service instance.
    file_id: ID of the file to update.
    new_title: New title for the file.
    new_description: New description for the file.
    new_mime_type: New MIME type for the file.
    file_with_update: Filename of the new content to upload.
    new_revision: Whether or not to create a new revision for this file.
  Returns:
    Updated file metadata if successful, None otherwise.
  """
  try:
    # First retrieve the file from the API.
    file = service.files().get(fileId=file_id).execute()
    
    file['title'] = new_title
    '''
    # File's new metadata.
    file['title'] = new_title
    file['description'] = new_description
    file['mimeType'] = new_mime_type
    '''


    # Send the request to the API.
    updated_file = service.files().update(
        fileId=file_id,
        body=file).execute()
    return updated_file
  except errors.HttpError, error:
    print 'An error occurred: %s' % error
    return None
    
    
    
def get_service(user):
    storage = Storage(CredentialsModel, 'id', user, 'credential')
    credential = storage.get()
    
    if credential is None or credential.invalid == True:
        #return HttpResponseRedirect("/login/")
        return redirect('google_login.views.index')
    
    else:
        http = httplib2.Http()
        http = credential.authorize(http)
        drive_service = build("drive", "v2", http=http)
        
        return drive_service
    
    
    
    
    
    
def retrieve_all_files(service, search):
  """Retrieve a list of File resources.

  Args:
    service: Drive API service instance.
  Returns:
    List of File resources.
  """
  result = []
  page_token = None
  while True:
    try:
      param = {}
      param['q'] = search
      param['maxResults'] = 50
      param['fields'] = "items(thumbnailLink,owners/displayName,id,iconLink,mimeType,lastViewedByMeDate,fileExtension,title),nextPageToken"
      if page_token:
        param['pageToken'] = page_token
      files = service.files().list(**param).execute()

      result.extend(files['items'])
      page_token = files.get('nextPageToken')
      if not page_token:
        break
      if param['maxResults']:
        break
    except errors.HttpError, error:
      return error
      break
  return result
    
    
    
def createGoogleFolder(user, parentFolderID, folderName):
    drive_service = get_service(user)
    
    if drive_service:
        body = {
            'title': "Duck Soup Worksheets",
            'description': 'Duck Soup Folder',
            'mimeType': 'application/vnd.google-apps.folder',
        }
        
        if parentFolderID:
            body["parents"] = [{"id":str(parentFolderID)}]
            
        if folderName:
            body["title"] = folderName
            
        
        returnedFile = drive_service.files().insert(body=body).execute()
        
        log.info(returnedFile)
        
        return returnedFile['id']
    else:
        return False
    


def checkOrCreateGoogleFolder(user, folderID, parentFolderID, folderName):
    if folderID:
        drive_service = get_service(user)
        file = get_file(drive_service, folderID)
        if file:
            if file['labels']['trashed']:
                restore_file_from_trash(drive_service, folderID)
                
            return file['id']
        else:
            return createGoogleFolder(user, parentFolderID, folderName)
    else:
        return createGoogleFolder(user, parentFolderID, folderName)
    
def djangoLogin(request, user):
    user.backend = 'django.contrib.auth.backends.ModelBackend'
    login(request, user)
    return True
    
    
    
    

    
    
