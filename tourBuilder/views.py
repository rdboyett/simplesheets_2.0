import json

from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

from tourBuilder.models import MyTour





def countTour(request):
    if request.method == 'POST':
        tourID = request.POST["tourID"]
        
        
        if MyTour.objects.filter(id=tourID):
            myTour = MyTour.objects.get(id=tourID)
            myTour.nTimesRan += 1
            myTour.save()
            data = {'success':'success'}
        else:
            data = {"error":"Sorry, something went wrong with the tour."}
    else:
        data = {"error":"Sorry, something went wrong with the post."}
        
    return HttpResponse(json.dumps(data))






def resetTour(request):
    if request.method == 'POST':
        tourName = request.POST["tourName"]
        
        
        if MyTour.objects.filter(user=request.user, name=tourName):
            myTour = MyTour.objects.get(user=request.user, name=tourName)
            myTour.nTimesRan = 0
            myTour.save()
            data = {'success':'success'}
        else:
            data = {"error":"Sorry, something went wrong with the tour."}
    else:
        data = {"error":"Sorry, something went wrong with the post."}
        
    return HttpResponse(json.dumps(data))


