import datetime

from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe, SafeData, mark_for_escaping

from userInfo_profile.models import UserInfo, MyGrade, MyAnswer
from classrooms.models import Classroom, ClassUser
from worksheet_creator.models import FormInput

register = template.Library()



@register.filter
def myAnswers(user, project):
    if UserInfo.objects.filter(user=user):
        userInfo = UserInfo.objects.filter(user=user)
        if project.formInputs.all():
            #Get all possible questions
            questions = project.formInputs.all().order_by('questionNumber')
            if FormInput.objects.filter(myanswer__userInfo=userInfo, myanswer__project=project):  #MyAnswer.objects.filter(userInfo=userInfo, project=project):
                #get the questions that were answered
                myQuestions = FormInput.objects.filter(myanswer__userInfo=userInfo, myanswer__project=project).order_by('questionNumber')
                myAnswerTable = []
                for question in questions:
                    if question in myQuestions:
                        myAnswerTable.append(MyAnswer.objects.filter(userInfo=userInfo, answer=question, project=project))
                    else:
                        myAnswerTable.append({'empty':question})
                        
                return myAnswerTable
                
            else:
                return ['no answers']
        
        else:
            return ['no answers']
    else:
        return ['no answers']
    
    
    
    
@register.filter
def myGrade(user, project):
    if UserInfo.objects.filter(user=user):
        userInfo = UserInfo.objects.filter(user=user)
        if MyGrade.objects.filter(project=project, userInfo=userInfo, highestGrade=True):
            if MyGrade.objects.filter(project=project, userInfo=userInfo, highestGrade=True).count() > 1:
                return MyGrade.objects.filter(project=project, userInfo=userInfo, highestGrade=True)[0].average
            else:
                return MyGrade.objects.get(project=project, userInfo=userInfo, highestGrade=True).average
        else:
            return 'no grade'
    else:
        return 'no grade'
    
    
    
@register.filter
def getStudentsClass(worksheet, classUser):
    if Classroom.objects.filter(classuser=classUser, worksheets=worksheet).count() > 1:
        return Classroom.objects.filter(classuser=classUser, worksheets=worksheet)[0].id
    else:
        return Classroom.objects.get(classuser=classUser, worksheets=worksheet).id
    
    
    
@register.filter
def attempts_left(project, student):
    if UserInfo.objects.filter(user=student.user):
        userInfo = UserInfo.objects.filter(user=student.user)
        if MyGrade.objects.filter(project=project, userInfo=userInfo, highestGrade=True):
            myGrade = MyGrade.objects.get(project=project, userInfo=userInfo, highestGrade=True)
            if project.numberOfRetry > myGrade.timesGraded:
                return project.numberOfRetry - myGrade.timesGraded
            else:
                return False
        else:
            return 'no grade'
    else:
        return False
    
    
    
    
@register.filter
def checkAnswerExists(currentInput, myAnswersList):
    if myAnswersList.filter(answer=currentInput):
        return True
    else:
        return False
    
    
    
    
@register.filter
def totalStudentsComplete(worksheet):
    if MyGrade.objects.filter(project=worksheet):
        return MyGrade.objects.filter(project=worksheet).count()
    else:
        return "0"
    
    
    
@register.filter
def questionAverage(formInput):
    if MyAnswer.objects.filter(answer=formInput):
        #get the total number of answers to that question
        totalAnswers = MyAnswer.objects.filter(answer=formInput).count()
        totalCorrect = MyAnswer.objects.filter(answer=formInput, bCorrect=True).count()
        average = (float(totalCorrect)/float(totalAnswers)*100)
        if average >= 70:
            return '<i class="fa fa-arrow-circle-up text-success">{0:.2f}%</i>'.format(round(average),2)
        else:
            return '<i class="fa fa-arrow-circle-down text-danger">{0:.2f}%</i>'.format(round(average),2)
    else:
        return '<i class="fa fa-minus"></i>'
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    