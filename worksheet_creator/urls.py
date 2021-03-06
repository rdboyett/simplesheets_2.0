from django.conf.urls import patterns, include, url


urlpatterns = patterns('worksheet_creator.views',
    (r'^startCreate/(?P<fileId>.+)/$', 'startCreate'),
    (r'^create/$', 'create'),
    (r'^open/$', 'openGoogleFile'),
    (r'^createFromPDF/$', 'createFromPDF'),
    (r'^printStudentWork/$', 'printStudentWork'),
)

urlpatterns += patterns('worksheet_creator.ajax',
    (r'^checkProjectExists/$', 'checkProjectExists'),
    (r'^deleteOldProject/$', 'deleteOldProject'),
    (r'^assignWorksheets/$', 'assignWorksheets'),
    (r'^resetNumberRetry/$', 'resetNumberRetry'),
    
)


urlpatterns += patterns('worksheet_creator.page_view_ajax',
    url(r'^updateInputType/$', 'updateInputType', name='updateInputType'),
    url(r'^updatePoints/$', 'updatePoints', name='updatePoints'),
    url(r'^updateHelpText/$', 'updateHelpText', name='updateHelpText'),
    url(r'^updateHelpLink/$', 'updateHelpLink', name='updateHelpLink'),
    url(r'^updateKeyword/$', 'updateKeyword', name='updateKeyword'),
    url(r'^updateChoice/$', 'updateChoice', name='updateChoice'),
    url(r'^updateCorrectAnswer/$', 'updateCorrectAnswer', name='updateCorrectAnswer'),
    url(r'^updateQuestionNumber/$', 'updateQuestionNumber', name='updateQuestionNumber'),
    url(r'^imageAreaSet/$', 'imageAreaSet', name='imageAreaSet'),
    url(r'^submitDeleteInput/$', 'submitDeleteInput', name='submitDeleteInput'),
    url(r'^checkProjectExists/$', 'checkProjectExists', name='checkProjectExists'),
    url(r'^deleteOldProject/$', 'deleteOldProject', name='deleteOldProject'),
    url(r'^sendStudentAnswer/$', 'sendStudentAnswer', name='sendStudentAnswer'),
    url(r'^submitGradeWorksheet/$', 'submitGradeWorksheet', name='submitGradeWorksheet'),
    url(r'^setWorkImage/$', 'setWorkImage', name='setWorkImage'),
    url(r'^updateInputPosition/$', 'updateInputPosition', name='updateInputPosition'),
    url(r'^uploadWorkboxImage/$', 'uploadWorkboxImage', name='uploadWorkboxImage'),
    (r'^getWorksheets/$', 'getWorksheets'),
    (r'^deleteProject/$', 'deleteProject'),
    (r'^changeWorksheetName/$', 'changeWorksheetName'),
    (r'^toggleLockWorksheet/$', 'toggleLockWorksheet'),
    (r'^liveMonitorAnswers/$', 'liveMonitorAnswers'),
    (r'^forceGradeWorksheet/$', 'forceGradeWorksheet'),
    (r'^teacherGradeChange/$', 'teacherGradeChange'),
    (r'^deleteUser/$', 'deleteUser'),
    (r'^shareWorksheet/$', 'shareWorksheet'),
    (r'^sendLeftoverAnswers/$', 'sendLeftoverAnswers'),
    
)









