from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    (r'^logout/$', 'django.contrib.auth.views.logout',{'next_page': 'google_login.views.index'}),
)

urlpatterns += patterns('google_login.views',
    (r'^login/$', 'index'),
    (r'^auth/$', 'auth'),
    (r'^noPopAuth/$', 'noPopAuth'),
    (r'^oauth2callback/$', 'auth_return'),
    (r'^success/$', 'success'),
    (r'^error/$', 'error'),
    (r'^forgot/(?P<forgotID>\d+)/$', 'forgotPassword'),
    (r'^createAccount/$', 'createAccount'),
    (r'^passwordReset/$', 'passwordReset'),

#------------------ajax calls -------------------------------------
    url(r'^ajaxAuth/$', 'ajaxAuth', name='ajaxAuth'),
    url(r'^checkUsername/$', 'checkUsername', name='checkUsername'),
    url(r'^submitRegistration/$', 'submitRegistration', name='submitRegistration'),
    url(r'^doesEmailExist/$', 'doesEmailExist', name='doesEmailExist'),
    url(r'^submitPasswordForgot/$', 'submitPasswordForgot', name='submitPasswordForgot'),
    url(r'^syncGoogleAccount/$', 'syncGoogleAccount', name='syncGoogleAccount'),
    url(r'^ajaxResetPassword/$', 'ajaxResetPassword', name='ajaxResetPassword'),
    url(r'^changeUsername/$', 'changeUsername', name='changeUsername'),
    (r'^accountVerify/(?P<verifyID>(\d+))/$', 'accountVerify'),
    url(r'^accountVerifyCreate/$', 'accountVerifyCreate', name='accountVerifyCreate'),
    
)
