from django.contrib import admin

from .models import Project
from django.contrib.auth.models import User


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'user_fullname', 'username', 'email', 'backImages')
    search_fields = ('title', 'userinfo__user__first_name', 'userinfo__user__last_name', 'userinfo__user__email', 'userinfo__user__email')

    def user_fullname(self, obj):
        user = User.objects.get(id=obj.ownerID)
        return "%s %s" % (user.first_name, user.last_name)
    user_fullname.short_description = 'User'
    user_fullname.admin_order_field = 'user__last_name'

    def username(self, obj):
        user = User.objects.get(id=obj.ownerID)
        return user.username
    username.short_description = 'Username'
    username.admin_order_field = 'user__username'

    def email(self, obj):
        user = User.objects.get(id=obj.ownerID)
        return user.email
    email.short_description = 'Email'
    email.admin_order_field = 'user__email'

    def backImages(self, obj):
        return obj.backgroundImages.all()[0].imagePath
    backImages.short_description = 'Background Images'
    backImages.admin_order_field = 'backgroundImages'



admin.site.register(Project, ProjectAdmin)