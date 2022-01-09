from django.db.models import manager
from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework.views import APIView
from api.models import Questions,Options,Results,Subject
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt 
from django.contrib.auth.models import User
import datetime
from rest_framework.parsers import JSONParser
from .serializers import SubjectSerializer,QuestionSerializer 

@csrf_exempt
def subqs(request):
   if request.method == 'GET': 
       f=[]
       
       sub =Subject.objects.all()
       for s in sub:
           ff={}
           a=[]
           b=[]
           c=[]
           qs = Questions.objects.filter(subject=s)
           for x in qs:
               aa={}
               aaOption=[]
               aa['ques']=x.title
               aa['id']=x.id
               ans = Options.objects.filter(question=x)
               for asss in ans:
                   aaaOpt={}
                   aaaOpt['opt']=asss.title
                   aaaOpt['id']=asss.id
                   aaaOpt['mrks']=asss.marks
                   aaOption.append(aaaOpt)
                   aa['options']=aaOption
                   if x.type==1:
                       a.append(aa)
                   elif x.type==2:
                       b.append(aa)
                   elif x.type==3:
                       c.append(aa)
           ff['section']=s.sub_name
           ff['qs']=s.sub_qs
           ff['time']=s.sub_time
           ff['easy']=a
           ff['medium']=b
           ff['hard']=c
           f.append(ff)
       print(f)
       return JsonResponse({'data':f},safe=False)

# Create your views here.
def qs(request):
    a=[]
    c=[]
    b=[]
    if request.method =='GET':
        qs = Questions.objects.all()
        for x in qs:
            aa={}
            aaOption=[]
            aa['ques']=x.title
            ans = Options.objects.filter(question=x)
            for asss in ans:
                aaaOpt={}
                aaaOpt['opt']=asss.title
                aaaOpt['mrks']=asss.marks
                aaOption.append(aaaOpt)
            
            aa['options']=aaOption
            if x.type==1:
                a.append(aa)
            elif x.type==2:
                b.append(aa)
            elif x.type==3:
                c.append(aa)
            # print(a)
            # print(b)
            # print(c)

                
    return JsonResponse({'easy':a,'medium':b,'hard':c},safe=False)

class BlackListTokenView(APIView):
    permission_classes=[AllowAny]

    def post(self,request):
        try:
            refresh_token=request.data['refresh_token']
            token=RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def results(request,name):
    if request.method == 'POST':
        user = User.objects.get(username = name) 
        if(user):
            d = datetime.datetime.now()
            try:
                Results.objects.get(student = user).delete()
            except Results.DoesNotExist:    
                print('No previous entry')
            result = Results.objects.create(student = user,startTime = d.time())
            result.save()
            return JsonResponse("Result entry created",safe=False)
        else:
            return JsonResponse("User Doesn't exist",safe=False)  

@csrf_exempt        
def marks(request):
    if request.method == 'POST':
        data=JSONParser().parse(request)['data']
        d = datetime.datetime.now()
        user = User.objects.get(username = data['username'])
        if(user):
            result = Results.objects.get(student = user)
            if(result):
                result.endTime = d.time()
                result.marks = data['marks']
                result.save()
                return JsonResponse("Marks stored",safe=False)
            else:
                return JsonResponse("Restart Test",safe=False)    
        else:
            return JsonResponse("User Doesn't exist",safe=False)     
@csrf_exempt        
def addQs(request):
    if request.method == 'POST':
        data=JSONParser().parse(request)['data']
        print(data)
        if data['action']=='Save':
            f=Questions(subject=Subject.objects.get(sub_name=data['sectionName']),title=data['questionNew'],type=data['type'])
            f.save()
              
        elif data['action']=='Update':
            print('update')
            qData = {x: data[x] for x in data if 'question' in x}
            print(qData)
            for qs in qData:
                f=Questions.objects.get(id=qs.split('question')[1])
                f.title=qData[qs]
                f.save()

                print(f)
                print(qData[qs])
                Options.objects.filter(question=f).delete()
        optionData = {x: data[x] for x in data if 'Option' in x}
        print(data)
        for z in optionData:
            print(z)
            print(z==data['rightOpt'])
            if z==data['rightOpt']:
                if data['type']==1:
                    marks=1
                elif data['type']==2:
                    marks=2
                elif data['type']==3:
                    marks=5
            else:
                marks=0
            print(marks)
            ff=Options(question=f,marks=marks,title=optionData[z])
            ff.save()
        return JsonResponse("Done",safe=False) 