from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from .ajax import ChangeTeacherStudentView

urlpatterns = patterns('',
    url(r'^changeTeacherStudent/', ChangeTeacherStudentView.as_view(), name='changeTeacherStudent'),
    url(r'^success/', TemplateView.as_view(template_name="success.html"), name='changeTeacherStudentSuccess'),
)

urlpatterns += patterns('classrooms.ajax',
    (r'^createGroup/$', 'createGroup'),
    (r'^deleteGroup/$', 'deleteGroup'),
    (r'^changeGroupName/$', 'changeGroupName'),
    (r'^toggleLockGroup/$', 'toggleLockGroup'),
    (r'^joinGroup/$', 'joinGroup'),
    (r'^postMessage/$', 'postMessage'),
    (r'^deleteMessage/$', 'deleteMessage'),
    (r'^addAdminUsers/$', 'addAdminUsers'),
    (r'^adminDeleteUser/$', 'adminDeleteUser'),
    (r'^editProfile/$', 'editProfile'),
    (r'^getOldMessages/$', 'getOldMessages'),
    (r'^getNewMessages/$', 'getNewMessages'),
    (r'^removeFromClass/$', 'removeFromClass'),
    (r'^newCode/$', 'newCode'),
)

