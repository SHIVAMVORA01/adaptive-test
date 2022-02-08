from django.contrib import admin
from .models import (CodingTest, MyUser, Questions,Options,Results,Subject,Test,Paraqs,Paraopt,Para,MyUser)

# Register your models here.
admin.site.register(Questions)
admin.site.register(Options)
admin.site.register(Results)
admin.site.register(Subject)
admin.site.register(Test)
admin.site.register(CodingTest)
admin.site.register(Paraqs)
admin.site.register(Paraopt)
admin.site.register(Para)

admin.site.register(MyUser)
