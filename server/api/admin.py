from django.contrib import admin
from .models import (CodingTest, Feedback, MyUser, Questions,Options,Results,Subject,Test,Paraqs,Paraopt,Para,MyUser,ConstData)
from rest_framework_simplejwt import token_blacklist
from rest_framework_simplejwt.token_blacklist.admin import OutstandingTokenAdmin,OutstandingToken

# Register your models here.
admin.site.register(Questions)
admin.site.register(ConstData)
admin.site.register(Options)
admin.site.register(Results)
admin.site.register(Subject)
admin.site.register(Test)
admin.site.register(CodingTest)
admin.site.register(Paraqs)
admin.site.register(Paraopt)
admin.site.register(Para)
admin.site.register(MyUser)
admin.site.register(Feedback)

class OutstandingTokenAdmin(OutstandingTokenAdmin):
    def has_delete_permission(self, *args, **kwargs):
        return True
admin.site.unregister(OutstandingToken)
admin.site.register(OutstandingToken, OutstandingTokenAdmin)
