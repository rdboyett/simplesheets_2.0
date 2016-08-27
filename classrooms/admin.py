from django.contrib import admin

from .models import ClassUser

class ClassUserAdmin(admin.ModelAdmin):
    list_display = ('user_fullname', 'username', 'email', 'teacher')
    list_filter = ('teacher',)
    search_fields = ('user__first_name', 'user__last_name', 'user__username', 'user__email')

    def user_fullname(self, obj):
        return "%s %s" % (obj.user.first_name, obj.user.last_name)
    user_fullname.short_description = 'User'
    user_fullname.admin_order_field = 'user__last_name'

    def username(self, obj):
        return obj.user.username
    username.short_description = 'Username'
    username.admin_order_field = 'user__username'

    def email(self, obj):
        return obj.user.email
    email.short_description = 'Email'
    email.admin_order_field = 'user__email'

admin.site.register(ClassUser, ClassUserAdmin)
