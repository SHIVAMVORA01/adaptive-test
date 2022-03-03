from posixpath import split
from django.contrib.auth.hashers import make_password
import json
from django.http import HttpResponseBadRequest, HttpResponseForbidden
from django.http.response import JsonResponse
from rest_framework.views import APIView
from api.models import Questions,Options,Results,Subject,Test,CodingTest,Para,Paraopt,Paraqs,MyUser,Feedback,ConstData
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt 
from django.contrib.auth.models import User
import datetime
from rest_framework.parsers import JSONParser
import random
from .serializers import CodingTestSerializer, MyUserSerializer, OptSerializer, SubjectSerializer,QuestionSerializer, TestSerializer ,ResultSerializer,OptionSerializer,AllUserSerializer
import math
from django.db.models import Q
from dateutil import tz
import cloudinary
import cloudinary.search
from django.contrib.auth.models import User,auth
from django.core.mail import send_mail,EmailMultiAlternatives
from django.template.loader import get_template
from django.conf import settings
import uuid
CFG = {'DB': None}
import pandas as pd

def predict():
    regressor = pd.read_pickle(r'server\model.pickle') 
    result = regressor.predict([[0,0,0,0,0]])
    return int(result[0])

def constdata(request):
    if request.method == "GET":
        data = ConstData.objects.all()
        return JsonResponse({"colleges":data[0].colleges,"departments":data[0].departments},safe=False)
        
def checkAuthorization(auth):
    if (auth!='null'):
        _token=auth.split(" ")[1]
        try:
            token=AccessToken(_token)
            if(token):
                return True
            else:
                return False
        except:
            return False

def error_404(request):
    return HttpResponseForbidden()
@csrf_exempt
def newuser(request):
    if request.method=="GET":
        if(User.objects.filter(username = request.GET['email']).exists()):
            return JsonResponse({'exists':1},safe=False)
        else:
            return JsonResponse({'exists':0},safe=False) 

    if request.method=="POST":
        data=JSONParser().parse(request)['data']
        user = User.objects.create(first_name=data['name'],username = data['email'],email=data['email'],password=make_password(data['pass']))   
        myuser = MyUser.objects.filter(user=user)
        if(myuser.exists()):
            myuser[0].delete()
        if int(data['gender'])==1:
            gender="Male"
        elif int(data['gender'])==2:
            gender="Female"
        else:
            gender="Other"
        newuser = MyUser(user=user,name=data['name'],email=data['email'],
                        age=int(data['age']),gender=gender,mobile=int(data['mobileNo']),
                        percent_10_std=int(data['percent_10_std']),percent_12_std=int(data['percent_12_std']),
                        avgCGPA=float(data['avgCGPA']),backlogs=int(data['backlogs']),
                        internships=int(data['internships']),branch=data['branch'],
                        college=data['college'],year=data['graduationYear']
                        )
        user.save()
        newuser.save()
        return JsonResponse({"msg":"Success","created":True,'exists':0},safe=False)     

@csrf_exempt
def login(request):
     if request.method == 'POST' :
        data=JSONParser().parse(request)['data']
        username = data['username']
        password = data['password']
        user = auth.authenticate(username = username,password = password)
        if user is not None:
            auth.login(request,user)
            if User.objects.get(username=username).is_staff ==True:
                return JsonResponse({"exist":1,"allowed":1,"admin":1},safe=False)
            else :
                if int(data['mytid'])==-1:
                    return JsonResponse({"exist":1,"allowed":1,"admin":0},safe=False)
                testx = Test.objects.get(id=int(data['mytid']))
                if testx.token == user.last_name:
                    return JsonResponse({"exist":1,"allowed":1,"admin":0},safe=False)
                else:
                    return JsonResponse({"exist":1,"allowed":0,"admin":0},safe=False)       
        else:
            return JsonResponse({"exist":0},safe=False)

@csrf_exempt
def changepass(request):
    if request.method=="POST":
        data=JSONParser().parse(request)['data']
        if data['token'] != "":
            if not MyUser.objects.filter(change_pass_token=data['token']).exists():
                return JsonResponse({'exists':0},safe=False)  
            myuser = MyUser.objects.get(change_pass_token = data['token'])
            user = myuser.user
            user.set_password(data['pass'])
            user.save()
            myuser.change_pass_token=None
            myuser.save()
            return JsonResponse({'exists':1},safe=False)   
        else:
           return JsonResponse({'exists':0},safe=False)         

@csrf_exempt
def checkpassToken(request):
    if request.method=="POST":
        data=JSONParser().parse(request)['data']
        user = User.objects.filter(email = data['mail'])
        if user.exists():
            myuser = user[0].myuser
            if myuser.change_pass_token == data['token']:
                return JsonResponse({'exists':1},safe=False)
            else:
                return JsonResponse({'exists':0},safe=False)
        else:
                return JsonResponse({'exists':0},safe=False)            

@csrf_exempt
def forgotpass(request):
    if request.method=="POST":
        data=JSONParser().parse(request)['data']
        user=User.objects.filter(email=data['email'])
        if not user.exists():
            return JsonResponse({'exists':0},safe=False)
        else:
            token = str(uuid.uuid4())
            subject = "Your Forget Password Link"
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [user[0].email]
            # send_mail(subject,message,email_from,recipient_list)
            msg=EmailMultiAlternatives(subject=subject,from_email=email_from,to=recipient_list)
            args={}
            args['name']='{}'.format(user[0].first_name)
            args['url']='http://localhost:3000/change-pass?token={0}&user={1}'.format(token,user[0].email)
            html_template=get_template("api/ChangePassword.html").render(args)
            msg.attach_alternative(html_template,"text/html")
            msg.send()
            myuser =user[0].myuser
            myuser.change_pass_token = token
            myuser.save()
            return JsonResponse({'exists':1},safe=False)

@csrf_exempt
def getuserslist(request):
    if request.method == "GET":
        d = datetime.datetime.utcnow()
        presentTest=Test.objects.filter(test_start__lte = d,test_end__gt=d)
        if not presentTest.exists():   
            return JsonResponse({'exists':0},safe=False) 
        testx = presentTest[0]
        allowed = User.objects.filter(last_name = testx.token).exclude(is_staff=True)
        notallowed = User.objects.all().exclude(last_name = testx.token).exclude(is_staff=True)
        bb=[]
        for xx in allowed:
            b={}
            b['id'] = xx.id
            b['first_name'] = xx.first_name
            b['email'] = xx.email
            bb.append(b) 
        aa=[]
        for xx in notallowed:
            a={}
            a['id'] = xx.id
            a['checkBtn'] = False
            a['first_name'] = xx.first_name
            a['email'] = xx.email
            aa.append(a)
        return JsonResponse({'exists':1,'allowed':bb,'notallowed':aa},safe=False)

@csrf_exempt
def send_custom_mail(request):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method == "POST":
            data=JSONParser().parse(request)['data']
            userrs=[]
            if len(data['userId'])!=0:
                users = data['userId']
                for user in users:
                    x = User.objects.get(id=int(user))
                    userrs.append(x.email)
            subject = data["subject"]
            email_from = settings.EMAIL_HOST_USER
            recipient_list = userrs
            msg=EmailMultiAlternatives(subject=subject,from_email=email_from,to=recipient_list)
            args={}
            args["body"]=data["body"]
            html_template=get_template("api/CustomMail.html").render(args)
            msg.attach_alternative(html_template,"text/html")
            msg.send()
            return JsonResponse({'success':True},safe=False)

@csrf_exempt
def permission(request):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method == "POST":
            data=JSONParser().parse(request)['data']
            d = datetime.datetime.utcnow()
            presentTest=Test.objects.filter(test_start__lte = d,test_end__gt=d)
            if not presentTest.exists():   
                return JsonResponse({'exists':0},safe=False)
            testx = presentTest[0]
            users = data['users']
            userrs=[]
            for user in users:
                x = User.objects.get(id=int(user))
                x.last_name = testx.token
                userrs.append(x.email)
                x.save()
            subject = "Invitation Link For Aptitude Test"
            email_from = settings.EMAIL_HOST_USER
            recipient_list = userrs
            # send_mail(subject,message,email_from,recipient_list)
            msg=EmailMultiAlternatives(subject=subject,from_email=email_from,to=recipient_list)
            args={}
            args['Start']='{}'.format(converttoist(testx.test_start)[0] )
            args['End']='{}'.format(converttoist(testx.test_end)[0])
            args['testName']='{}'.format(testx.test_name)
            html_template=get_template("api/Permission.html").render(args)
            msg.attach_alternative(html_template,"text/html")
            msg.send()
            return JsonResponse({'exists':1},safe=False)
    else:
        return HttpResponseBadRequest()

@csrf_exempt
def subqs(request,subject=0,tid=0):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method == 'GET':
            a=[]
            b=[]
            c=[]
            test = Test.objects.get(id=tid)
            sub =Subject.objects.get(id=subject)
            qs = Questions.objects.filter(subject=sub)
            # if() to get time and avg score
            avg,time,qsno=0,"00:00:00",0
            if sub.sub_name == 'Aptitude':
                avg=test.apt['avg']
                time=test.apt['time']
                qsno=test.apt['qs']
            elif sub.sub_name == 'Computer Fundamentals':
                avg =test.cf['avg']
                time=test.cf['time']
                qsno=test.cf['qs']
            elif sub.sub_name == 'Coding':
                avg =test.c['avg']
                time=test.c['time'] 
                qsno=test.c['qs']  
            elif sub.sub_name == 'Domain':
                avg =test.dom['avg']
                time=test.dom['time'] 
                qsno=test.dom['qs']   
            elif sub.sub_name == 'Personality':
                avg =test.p['avg'] 
                time=test.p['time'] 
                qsno=test.p['qs']  
            elif sub.sub_name == 'Analytical Writing':
                avg =test.aw['avg']
                time=test.aw['time']
                qsno=test.aw['qs']

            if int(subject)!=4:
                for x in qs:
                        aa={}
                        # aaOption=[]
                        aa['ques']=x.title
                        aa['id']=x.id
                        aa['img'] = x.imgId
                        ans = Options.objects.filter(question=x)
                        aa['options'] = OptSerializer(ans,many=True).data
                        # for asss in ans:
                        #     aaaOpt={}
                        #     aaaOpt['opt']=asss.title
                        #     aaaOpt['id']=asss.id
                        #     aaaOpt['mrks']=asss.marks
                        #     aaOption.append(aaaOpt)
                        if x.type==1:
                            a.append(aa)
                        elif x.type==2:
                            b.append(aa)
                        elif x.type==3:
                            c.append(aa)
                
                return JsonResponse({'avg':avg,'qs':qsno,'time':time,'easy':a,'medium':b,'hard':c},safe=False)
            elif int(subject)==4:
                for x in qs:
                    aa={}
                    aa['ques']=x.title
                    aa['id']=x.id
                    a.append(aa)
                return JsonResponse({'qs':qsno,'avg':avg,'time':time,'allQs':a},safe=False )
    else:
        return HttpResponseBadRequest()

@csrf_exempt
def subs(request):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method == 'GET':
            f={}
            subs=Subject.objects.all()
            for sub in subs:
                f[sub.sub_name]={}
                f[sub.sub_name]={}
                f[sub.sub_name]['easy']=[]
                f[sub.sub_name]['medium']=[]
                f[sub.sub_name]['hard']=[]
                f[sub.sub_name]['qs']=sub.sub_qs
                f[sub.sub_name]['time']=sub.sub_time
            codingTest=CodingTest.objects.all()
            for c in codingTest:
                c=CodingTestSerializer(c).data
                if c['type']==1:
                    f['Coding']['easy'].append(c)
                elif c['type']==2:
                    f['Coding']['medium'].append(c)
                elif c['type']==3:
                    f['Coding']['hard'].append(c)
            paras=Para.objects.all()
            for para in paras:
                x={}
                x['title'] = para.title
                x['paraId'] = para.id
                x['para'] = para.data
                questions = Paraqs.objects.filter(para=para)
                qs = []
                for question in questions:
                    op={}
                    options = Paraopt.objects.filter(paraqs=question)
                    op['question'] = question.title
                    op['paraQsId'] = question.id
                    op['options'] =OptionSerializer(options,many=True).data
                    qs.append(op)
                x['questions'] = qs 
                f['Analytical Writing']['medium'].append(x)  
                

            qs=Questions.objects.all()
            for q in qs:
                a={} 
                if str(q.subject.sub_name)!='Coding' and str(q.subject.sub_name)!='Analytical Writing':
                    a['ques']=q.title
                    a['id']=q.id
                    a['imgId']=q.imgId
                    # a['options']=[]
                    opts=Options.objects.filter(question=q)
                    a['options'] = OptSerializer(opts,many=True).data
                    # for opt in opts:
                    #     o={}
                    #     o['opt']=opt.title
                    #     o['id']=opt.id
                    #     o['mrks']=opt.marks
                    #     a['options'].append(o)
                    if q.type==1:
                        f[str(q.subject)]['easy'].append(a)
                    if q.type==2:
                        f[str(q.subject)]['medium'].append(a)
                    elif q.type==3:
                        f[str(q.subject)]['hard'].append(a)
            return JsonResponse({'data':f},safe=False)
    else:
        return HttpResponseBadRequest()

def qs(request):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        a=[]
        c=[]
        b=[]
        if request.method =='GET':
            qs = Questions.objects.all()
            for x in qs:
                aa={}
                # aaOption=[]
                aa['ques']=x.title
                ans = Options.objects.filter(question=x)
                aaOption = OptSerializer(ans,many=True).data
                # for asss in ans:
                #     aaaOpt={}
                #     aaaOpt['opt']=asss.title
                #     aaaOpt['mrks']=asss.marks
                #     aaOption.append(aaaOpt)
                
                aa['options']=aaOption
                if x.type==1:
                    a.append(aa)
                elif x.type==2:
                    b.append(aa)
                elif x.type==3:
                    c.append(aa)

                    
        return JsonResponse({'easy':a,'medium':b,'hard':c},safe=False)
    else:
        return HttpResponseBadRequest()

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
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        user = User.objects.get(username = name) 
        if request.method == 'POST':
            data=JSONParser().parse(request)['data']
            test = Test.objects.get(id=data['testId'])
            if user:
                myUser=user.myuser
                name=myUser.name
                gender=myUser.gender
                age=myUser.age
                try:
                    if name != 'a' and user.is_staff!=True:
                        rr=Results.objects.get(student = user,test=test)
                        if rr:
                            if rr.endTime!=None:
                                return JsonResponse({'end':True,'resultExists':True,'name':name,'gender':gender,'age':age},safe=False)
                            else:
                                timeDelta=test.totalTestTime.split(':')
                                time_change = datetime.timedelta(hours=int(timeDelta[0]),minutes=int(timeDelta[1]),seconds=int(timeDelta[2]))
                                stTime=datetime.datetime.strptime(str(rr.startTime).split(".")[0], '%Y-%m-%d %H:%M:%S')
                                expTimeToEndExam=stTime+time_change
                                nowTime=datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
                                nowTime=datetime.datetime.strptime(nowTime, '%Y-%m-%d %H:%M:%S')   
                                if nowTime>expTimeToEndExam:
                                    rr.endTime=expTimeToEndExam
                                    rr.save()
                                    return JsonResponse({'end':True,'resultExists':True,'name':name,'gender':gender,'age':age},safe=False)
                                else:
                                    return JsonResponse({'end':False,'resultExists':True,'name':name,'gender':gender,'age':age},safe=False)
                    else:
                        Results.objects.get(student = user,test=Test.objects.get(id=data['testId'])).delete()
                except Results.DoesNotExist:
                    print('No previous entry')
                return JsonResponse({'end':False,'resultExists':False,'name':name,'gender':gender,'age':age},safe=False)    
            else:
                return JsonResponse("User Doesn't exist",safe=False)
        elif request.method=='GET':
            if user:
                testId=request.GET.get('testId')
                data=chartData(user,testId,False)
            
            return JsonResponse(data,safe=False)
    else:
        return HttpResponseBadRequest()
        
@csrf_exempt
def setresult(request,name):
    if request.method == "POST":
        if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
            user = User.objects.get(username = name)
            data=JSONParser().parse(request)['data']
            if user:
                test = Test.objects.get(id=data['testId'])
                avg_ap=test.apt['avg']
                avg_cf =test.cf['avg']
                avg_c =test.c['avg']
                avg_d =test.dom['avg']
                avg_p =test.p['avg']  
                avg_a =test.aw['avg']  
                d = datetime.datetime.utcnow()
                myUser=user.myuser
                name=myUser.name
                gender=myUser.gender
                age=myUser.age
                result = Results.objects.create(student = user,startTime = d,test=Test.objects.get(id=data['testId']),
                marks={"ap":0,'cf':0,'c':0,'d':0,'p':0,'a':0,"avg_ap":avg_ap,'avg_cf':avg_cf,'avg_c':avg_c,'avg_d':avg_d,'avg_p':avg_p,'avg_a':avg_a,'apMax':[],'cfMax':[],'cMax':[],'dMax':[],'pMax':[],'aMax':[],'apGot':[],'cfGot':[],'cGot':[],'dGot':[],'pGot':[evaluate(request,{'Nick':name,'Sex':'Male','Age':21,'Q':[0]*(121),'Country':'India'})],'aGot':[]}
                )
                result.save()
                return JsonResponse({'end':False,'resultExists':False,'name':name,'gender':gender,'age':age},safe=False)
            else:
                return JsonResponse("User Doesn't exist",safe=False)    
        else:
            return HttpResponseBadRequest()      

def converttoist(datex):
    from_zone = tz.tzutc()
    to_zone = tz.tzlocal()
    datex = str(datex).split('+')[0]
    datex1 = str(datex).rsplit(':',1)[0]+':'
    datex2 = str(datex).rsplit(':',1)[1][:2]
    datex = datex1+datex2
    datex = datex.split(".")[0]
    utc = datetime.datetime.strptime(datex, '%Y-%m-%d %H:%M:%S')
    
    # Tell the datetime object that it's in UTC time zone since 
    # datetime objects are 'naive' by default
    utc = utc.replace(tzinfo=from_zone)
    # Convert time zone
    central = str(utc.astimezone(to_zone))
    central = central.split('+')[0]
    central = central.split('T')
    return central

def chartData(user,testId=-1,isPost=False):
    totalQs=0
    # subs=Subject.objects.all()
    a=[]
    aa={}
    mrksScored=[]
    mrksScoredPercent=[]
    # for sub in subs:
    #     if sub.sub_name!='Personality':
    #         totalQs+=sub.sub_qs
    #         avgMarks=sub.sub_qs*2*0.7 # 70% average
    #         avgMarks=math.ceil(avgMarks)
    #         aa[sub.sub_name]=avgMarks

    # a=[aa['Aptitude'],aa['Computer Fundamentals'],aa['Domain'],aa['Coding'],aa['Analytical Writing']]
    try:
        resl=Results.objects.get(student = user,test=Test.objects.get(id=testId))     
        aa['Aptitude']=resl.marks['avg_ap']
        aa['Computer Fundamentals']=resl.marks['avg_cf']
        aa['Domain']=resl.marks['avg_d']
        aa['Coding']=resl.marks['avg_c']
        aa['Analytical Writing']=resl.marks['avg_a']
        a=[aa['Aptitude'],aa['Computer Fundamentals'],aa['Domain'],aa['Coding'],aa['Analytical Writing']]
        apMax=1
        cfMax=1
        dMax=1
        pMax=1
        aMax=1
        cMax=1
        if(sum(resl.marks['apMax'])>0):
            apMax=sum(resl.marks['apMax'])
        if(sum(resl.marks['cfMax'])>0):
            cfMax=sum(resl.marks['cfMax'])
        if(sum(resl.marks['dMax'])>0):
            dMax=sum(resl.marks['dMax'])
        if(sum(resl.marks['cMax'])>0):
            cMax=sum(resl.marks['cMax'])
        if(sum(resl.marks['aMax'])>0):
            aMax=sum(resl.marks['aMax'])
        mrksScoredPercent=[round((resl.marks['ap']/apMax)*100,2),round((resl.marks['cf']/cfMax)*100,2),round((resl.marks['d']/dMax)*100,2),round((resl.marks['c']/cMax)*100,2),round((resl.marks['a']/aMax)*100,2)]
        mrksScored=[resl.marks['ap'],resl.marks['cf'],resl.marks['d'],resl.marks['c'],resl.marks['a']]
        FMT = '%H:%M:%S'
        s1 = "{}:{}:{}".format(str(resl.endTime.hour),str(resl.endTime.minute),str(resl.endTime.second))
        s2 = "{}:{}:{}".format(str(resl.startTime.hour),str(resl.startTime.minute),str(resl.startTime.second))
        tdelta = datetime.datetime.strptime(str(s1), FMT) - datetime.datetime.strptime(str(s2), FMT)

    except Results.DoesNotExist:
        print('No previous entry')
        resl=0
    takeFeedback=0
    if(user.is_staff):
        user_detail=AllUserSerializer(user).data
    else:
        myUser=user.myuser
        if isPost:
            takeFeedback=myUser.takeFeedback
        user_detail=MyUserSerializer(myUser).data
    return {'startTime':resl.startTime,'endTime':resl.endTime,'personalityData':resl.marks['pGot'],'marks':resl.marks,'totalQs':totalQs,'avgMarksArr':a,'mrksScored':mrksScored,'mrksScoredPercent':mrksScoredPercent,'totalMarksScored':sum(mrksScored),'timeTaken':tdelta.seconds,'res_id':resl.id,'user_detail':user_detail,'takeFeedback':takeFeedback}

@csrf_exempt
def takeFeedback(request):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method=='POST':
            data=JSONParser().parse(request)['data']
            qs=MyUser.objects.all()
            if int(data['isAllSelected'])==1:
                qs.update(takeFeedback=1)
            else:
                qs.update(takeFeedback=0)
                if len(data['userId'])!=0 and int(data['isAllSelected'])==0:
                    for id in data['userId']:
                        user=MyUser.objects.get(id=id)
                        user.takeFeedback=1
                        user.save()
            return JsonResponse({'success':1},safe=False)

@csrf_exempt
def resultTest(request,id):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        testInfo=Test.objects.get(id=id)
        resultData=Results.objects.filter(test=testInfo)
        a={}
        a=ResultSerializer(resultData,many=True)
        
        cc=[]
        for x in a.data:
            c={}
            user=User.objects.get(id=x['student'])
            c['id']=x['id']
            c['uid']=user.id
            c['name']=user.username
            c['sdate']="{0} {1}".format(x['startTime'].split('T')[0],x['startTime'].split('T')[1].split('.')[0])
            startDateTime=converttoist(c['sdate'])
            c['sdate'] = startDateTime
            if(x['endTime']):
                c['edate']="{0} {1}".format(x['endTime'].split('T')[0],x['endTime'].split('T')[1].split('.')[0])
                c['edate'] = converttoist(c['edate'])
            else:
                timeDelta=testInfo.totalTestTime.split(':')
                time_change = datetime.timedelta(hours=int(timeDelta[0]),minutes=int(timeDelta[1]),seconds=int(timeDelta[2]))
                stTime=datetime.datetime.strptime(startDateTime[0].split(".")[0], '%Y-%m-%d %H:%M:%S')
                expTimeToEndExam=stTime+time_change
                nowTime=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                nowTime=datetime.datetime.strptime(nowTime, '%Y-%m-%d %H:%M:%S')
                if nowTime>expTimeToEndExam:
                    resultStudent=Results.objects.get(test=testInfo,student=user)
                    resultStudent.endTime=expTimeToEndExam
                    resultStudent.save()
                    c['edate']=expTimeToEndExam
                else:
                    c['edate']='ongoing'
            c['apt'] = x['marks']['ap']
            c['fund'] = x['marks']['cf']
            c['code'] = x['marks']['c']
            c['dom'] = x['marks']['d']
            c['analy'] = x['marks']['a']
            c['marks']=x['marks']['ap']+x['marks']['cf']+x['marks']['c']+x['marks']['d']+x['marks']['a']
            cc.append(c)

        return JsonResponse({'testData':a.data,'studentNameArr':cc},safe=False)
    else:
        return HttpResponseBadRequest()

@csrf_exempt        
def marks(request,sid=0):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method == 'POST':
            data=JSONParser().parse(request)['data']
            sid = int(sid)
            d = datetime.datetime.utcnow()
            user = User.objects.get(username = data['username'])
            if(user):
                result = Results.objects.get(student = user,test=Test.objects.get(id=data['testId']))
                
                if(result):
                    if sid == 1:
                        result.marks['ap'] = data['marks']
                        result.marks['apMax'] = data['maxMarks']
                        result.marks['apGot'] = data['gotMarks']
                    elif sid == 2:
                        result.marks['cf'] = data['marks']
                        result.marks['cfMax'] = data['maxMarks']
                        result.marks['cfGot'] = data['gotMarks']
                    elif sid == 3:
                        result.marks['c'] = data['marks']
                        result.marks['cMax'] = data['maxMarks']
                        result.marks['cGot'] = data['gotMarks']
                    elif sid == 4:
                        result.marks['d'] = data['marks']
                        result.marks['dMax'] = data['maxMarks']
                        result.marks['dGot'] = data['gotMarks']
                    elif sid == 5:
                        result.marks['p'] = data['marks']
                        result.marks['pGot']=[evaluate(request,{'Nick':data['name'],'Sex':data['gender'],'Age':data['age'],'Q':data['marks'],'Country':'India'})]
                    elif sid == 6:
                        result.marks['a'] = data['marks'] 
                        result.marks['aMax'] = data['maxMarks']
                        result.marks['aGot'] = data['gotMarks']
                        
                    else:
                        print('**error**')
                        return JsonResponse("Error",safe=False)
                    if data['check_result']:
                        result.endTime = d
                    result.save()
                    if data['check_result']:
                        data=chartData(user,data['testId'],True)
                    return JsonResponse(data,safe=False)
                else:
                    return JsonResponse("Restart Test",safe=False)
            else:
                return JsonResponse("User Doesn't exist",safe=False) 
    else:
        return HttpResponseBadRequest()

@csrf_exempt
def uploadCloudinary(request):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method=='POST':
            data=JSONParser().parse(request)['data']
            try:
                cloudinary.uploader.upload(data['image'],public_id='cld-sample',overwrite=True,resource_type='image')
                return JsonResponse("successfully uploaded",safe=False)
            except:
                print('Something went wrong')
                return JsonResponse("Error occured",safe=False)
    else:
        return HttpResponseBadRequest()
@csrf_exempt
def getImgs(request):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method=='GET':
            try:
                imgs=cloudinary.Search().expression('folder=demo').execute()
                return JsonResponse(imgs["resources"],safe=False)
            except:
                print('Something went wrong')
                return JsonResponse("Error occured",safe=False)
    else:
        return HttpResponseBadRequest()
@csrf_exempt        
def addQs(request):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method == 'POST':
            data=JSONParser().parse(request)['data']
            if str(data['sectionName'])!='Coding' and str(data['sectionName'])!='Analytical Writing':
                if data['action']=='Save':
                    if data['image']!=None: 
                        if data['image']!='':
                            try:
                                imgU=cloudinary.uploader.upload(data['image'],folder='adaptive_test/{0}'.format(data['sectionName']),invalidate_caches=True,overwrite=True,resource_type='image')
                                imgId=imgU['url']
                            except:
                                imgId=None
                        else:
                            imgId=None
                    f=Questions(subject=Subject.objects.get(sub_name=data['sectionName']),imgId=imgId,title=data['questionNew'],type=data['type'])
                    f.save()
                elif data['action']=='Update':               
                    qData = {x: data[x] for x in data if 'question' in x}
                    for qs in qData:                   
                        f=Questions.objects.get(id=qs.split('question')[1])
                        f.title=qData[qs]
                        f.type=data['type']
                        if data['image']!=None:  
                            if data['image']!='':
                                try:
                                    if f.imgId != None:
                                        public_id=f.imgId.split('adaptive_test/{0}/'.format(data['sectionName']))[-1]
                                        public_id=public_id.split('.')[0]
                                    else:
                                        public_id=''
                                    imgU=cloudinary.uploader.upload(data['image'],folder='adaptive_test/{0}/'.format(data['sectionName']),public_id=public_id,overwrite=True,resource_type='image')
                                    f.imgId=imgU['url']
                                except:
                                    print('error occured') 
                            else:
                                public_id_1='adaptive_test/{}'.format(data['sectionName'])
                                public_id_2='{}'.format(f.imgId.split(data["sectionName"])[1]).split('.')[0]
                                public_id='{0}{1}'.format(public_id_1,public_id_2)
                                try:       
                                    c=cloudinary.uploader.destroy(public_id=public_id)
                                    f.imgId=None
                                except:
                                    pass
                        f.save()
                        Options.objects.filter(question=f).delete()
                optionData = {x: data[x] for x in data if 'Option' in x}
                for z in optionData:
                    if z==data['rightOpt']:
                        if data['type']==1:
                            marks=1
                        elif data['type']==2:
                            marks=2
                        elif data['type']==3:
                            marks=5
                    else:
                        marks=0
                    ff=Options(question=f,marks=marks,title=optionData[z])
                    ff.save()
            elif str(data['sectionName'])=='Coding':
                test_case_input=[data['testCase1Input'],data['testCase2Input'],data['testCase3Input']]
                test_case_output=[data['testCase1Output'],data['testCase2Output'],data['testCase3Output']]
                if int(data['type'])==1:
                        marks=10
                elif int(data['type'])==2:
                    marks=20
                elif int(data['type'])==3:
                    marks=30
                if data['action']=='Save':            
                    f=CodingTest(question=data['questionNew'],marks=marks,type=data['type'],input_format=data['inputFormat'],
                    output_format=data['outputFormat'],constraints=data['constraints'],sample_input=[data['sampleInput']],sample_output=[data['sampleOutput']],explanation=data['explanation'],
                    test_case_input=test_case_input,test_case_output=test_case_output)
                    f.save()
                elif data['action']=='Update':
                    qData = {x: data[x] for x in data if 'question' in x}
                    for qs in qData:
                        f=CodingTest.objects.get(id=qs.split('question')[1])
                        f.question=qData[qs]
                        f.marks=marks
                        f.type=data['type']
                        f.input_format=data['inputFormat']
                        f.output_format=data['outputFormat']
                        f.constraints=data['constraints']
                        f.sample_input=[data['sampleInput']]
                        f.sample_output=[data['sampleOutput']]
                        f.explanation=data['explanation']
                        f.test_case_input=test_case_input
                        f.test_case_output=test_case_output
                        f.save()
            elif str(data['sectionName'])=='Analytical Writing':
                rightOptArrAnalytical=data['rightOptArrAnalytical']
                paragraphTitle=data['paragraphTitle']
                paragraph=data['paragraph']
                action=str(data['action'])
                qsDict=data['qsDict']
                paraId=data['paraId']
                if action=='Update':
                    para=Para.objects.get(id=paraId)
                    para.title=paragraphTitle
                    para.data=paragraph
                    para.save()
                    Paraqs.objects.filter(para=para).delete()
                elif action=='Save':
                    para=Para(title=paragraphTitle,data=paragraph)
                    para.save()     
                qslen = len(qsDict)
                qsmrks = 0
                if qslen>1:    
                    if qslen%2==0:
                        qsmrks= (20/qslen)
                    else:
                        qsmrks=math.floor(20/qslen)
                else:
                    qsmrks=20          
                for x in qsDict:
                    qs=Paraqs(para=para,title=qsDict[x]['title'])
                    qs.save()
                    for y in qsDict[x]['options']:
                        if str(rightOptArrAnalytical[x])==str(y):
                            marks=qsmrks
                        else:
                            marks=0
                        paraOpt=Paraopt(paraqs=qs,title=data[y],marks=marks)
                        paraOpt.save()

            return JsonResponse("Done",safe=False) 
    else:
        return HttpResponseBadRequest()

@csrf_exempt
def delQs(request):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method == 'POST':
            data=JSONParser().parse(request)['data']
            sid=int(data['sid'])
            for x in data['delQs']:
                if sid != 5 and sid != 6:
                    qs=Questions.objects.get(id=x)
                    if qs.imgId != None:
                        public_id_1='adaptive_test/{}'.format(qs.subject)
                        public_id_2='{}'.format(qs.imgId.split('{}'.format(qs.subject))[1]).split('.')[0]
                        public_id='{0}{1}'.format(public_id_1,public_id_2)
                        try:
                            c=cloudinary.uploader.destroy(public_id=public_id) #return {result:'ok'}
                        except:
                            pass
                    qs.delete()
                elif sid==5:
                    CodingTest.objects.get(id=x).delete()
                elif sid==6:
                    Para.objects.get(id=x).delete()
            return JsonResponse('success',safe=False)
    else:
        return HttpResponseBadRequest()
@csrf_exempt
def saveTest(request):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method == 'POST':
            data=JSONParser().parse(request)['data']
            tst=Test(test_name=data['createTest']['testName'],test_start=data['createTest']['sTime'],test_end=data['createTest']['eTime'],token=str(uuid.uuid4()))
            totalTestTime=datetime.timedelta(hours=0,minutes=0,seconds=0)
            for x in range(0,len(data['saveTest'])):
                avgMrk=0
                if str(data['saveTest'][x]['sub'])=='Coding' or str(data['saveTest'][x]['sub'])=='Analytical Writing':
                    avgMrk=30
                else:
                    avgMrk=math.ceil(int(data['saveTest'][x]['totalQs'])*2*0.7) # 70% average
                b=Subject.objects.get(sub_name=data['saveTest'][x]['sub'])
                splitTime=data['saveTest'][x]['time'].split(':')
                totalTestTime=totalTestTime+datetime.timedelta(hours=int(splitTime[0]),minutes=int(splitTime[1]),seconds=int(splitTime[2]))
                if(b.sub_name=="Aptitude"):
                    tst.apt = {
                        "qs":data['saveTest'][x]['totalQs'],
                        "time":data['saveTest'][x]['time'],
                        "avg":avgMrk,
                        "maxQs":data['saveTest'][x]['maxQs']
                    }
                elif(b.sub_name=="Computer Fundamentals"):
                    tst.cf = {
                        "qs":data['saveTest'][x]['totalQs'],
                        "time":data['saveTest'][x]['time'],
                        "avg":avgMrk,
                        "maxQs":data['saveTest'][x]['maxQs']
                    }
                elif(b.sub_name=="Domain"):
                    tst.dom = {
                        "qs":data['saveTest'][x]['totalQs'],
                        "time":data['saveTest'][x]['time'],
                        "avg":avgMrk,
                        "maxQs":data['saveTest'][x]['maxQs']
                    }
                elif(b.sub_name=="Personality"):
                    tst.p = {
                        "qs":data['saveTest'][x]['totalQs'],
                        "time":data['saveTest'][x]['time'],
                        "avg":avgMrk,
                        "maxQs":data['saveTest'][x]['maxQs']
                    }
                elif(b.sub_name=="Coding"):
                    tst.c = {
                        "qs":3,
                        "time":data['saveTest'][x]['time'],
                        "avg":avgMrk,
                        "maxQs":3 #
                    }
                else:
                    tst.aw = {
                        "qs":3,
                        "time":data['saveTest'][x]['time'],
                        "avg":avgMrk,
                        "maxQs":3 #
                    }
                b.sub_qs=data['saveTest'][x]['totalQs']
                b.max_qs=data['saveTest'][x]['maxQs']
                b.sub_time=data['saveTest'][x]['time']
                b.avg_score=avgMrk
                b.save()
                tst.save()
            tst.totalTestTime=totalTestTime
            tst.save()
            return JsonResponse('success',safe=False)
    else:
        return HttpResponseBadRequest()
@csrf_exempt
def tests(request,idd=0):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):  
        if request.method == 'POST':
            data=JSONParser().parse(request)['data']
            if not data['delete']:
                if data['update']:
                    test=Test.objects.get(id=data['id'])
                    test.test_name=data['name']
                    test.apt=data['apt']
                    test.cf=data['cf']
                    test.c=data['c']
                    test.dom=data['domain']
                    test.p=data['p']
                    test.aw=data['aw']
                    test.test_start=data['start']
                    test.test_end=data['end']
                    aptTimeArr=data['apt']['time'].split(':')
                    cfTimeArr=data['cf']['time'].split(':')
                    cTimeArr=data['c']['time'].split(':')
                    pTimeArr=data['p']['time'].split(':')
                    awTimeArr=data['aw']['time'].split(':')
                    domainTimeArr=data['domain']['time'].split(':')
                    totalTimeTaken=(
                        datetime.timedelta(
                        hours=int(aptTimeArr[0]),minutes=int(aptTimeArr[1]),seconds=int(aptTimeArr[2])
                    )+
                        datetime.timedelta(
                        hours=int(cfTimeArr[0]),minutes=int(cfTimeArr[1]),seconds=int(cfTimeArr[2])
                    )+
                        datetime.timedelta(
                        hours=int(cTimeArr[0]),minutes=int(cTimeArr[1]),seconds=int(cTimeArr[2])
                    )+
                        datetime.timedelta(
                        hours=int(domainTimeArr[0]),minutes=int(domainTimeArr[1]),seconds=int(domainTimeArr[2])
                    )+
                        datetime.timedelta(
                        hours=int(pTimeArr[0]),minutes=int(pTimeArr[1]),seconds=int(pTimeArr[2])
                    )+
                        datetime.timedelta(
                        hours=int(awTimeArr[0]),minutes=int(awTimeArr[1]),seconds=int(awTimeArr[2])
                    )
                    )
                    test.totalTestTime=totalTimeTaken
                    test.save()
                return JsonResponse('done',safe=False) 
        elif request.method == 'DELETE':
            Test.objects.get(id=idd).delete()        
            return JsonResponse('Created',safe=False) 
    else:
        return HttpResponseBadRequest()  

@csrf_exempt    
def getTests(request):
    if request.method == 'GET':
        d = datetime.datetime.utcnow()
        stests = Test.objects.filter(Q(test_end__lte=d) | Q(test_start__lt=d))
        utests = Test.objects.filter(test_start__gt=d) 
        stestS = TestSerializer(stests,many=True)
        utestS = TestSerializer(utests,many=True)
        presentTest=Test.objects.filter(test_start__lte = d,test_end__gt=d)
        bb=[]
        if(presentTest.exists()):
            b={}
            b['id'] = presentTest[0].id
            b['name']=presentTest[0].test_name
            b['start']="{0} {1}".format(presentTest[0].test_start.date(),str(presentTest[0].test_start.time()).split('.')[0])
            b['start'] = converttoist(b['start'])
            b['start']=b['start'][0]
            dicTime=durationBtwnDates(presentTest[0].test_start,presentTest[0].test_end)
            b['duration']=dicTime['duration']
            b['ends_in']=durationBtwnDates(datetime.datetime(d.year,d.month,d.day,d.hour,d.minute,d.second),datetime.datetime(presentTest[0].test_end.year,presentTest[0].test_end.month,presentTest[0].test_end.day,presentTest[0].test_end.hour,presentTest[0].test_end.minute,presentTest[0].test_end.second))['total_seconds']
            bb.append(b)
        cc=[]
        for x in utests:
            c={}
            c['name']=x.test_name
            c['start']="{0} {1}".format(x.test_start.date(),x.test_start.time())
            c['start'] = converttoist(c['start'])
            c['start']=c['start'][0]
            dicTime=durationBtwnDates(x.test_start,x.test_end)
            c['duration']=dicTime['duration']
            c['starts_in']=durationBtwnDates(datetime.datetime(d.year,d.month,d.day,d.hour,d.minute,d.second),datetime.datetime(x.test_start.year,x.test_start.month,x.test_start.day,x.test_start.hour,x.test_start.minute,x.test_start.second))['total_seconds']
            cc.append(c)
        return JsonResponse({"stests":stestS.data,"utests":utestS.data,'upcoming_test':cc,'ongoing_test':bb},safe=False)

def durationBtwnDates(start_date_time,end_date_time):
    diff=end_date_time-start_date_time
    seconds_in_day = 24 * 60 * 60
    vv=divmod(diff.days * seconds_in_day + diff.seconds, 60)
    time=vv[0]*60+vv[1]
    total_seconds=vv[0]*60+vv[1]
    day = time // (24 * 3600)
    time = time % (24 * 3600)
    hour = time // 3600
    time %= 3600
    minutes = time // 60
    time %= 60
    seconds = time
    if day<1:
        if hour<1:
            if minutes<1:
                duration='{} secs'.format(seconds)
            elif minutes==1:
                duration='{} min {} secs'.format(minutes,seconds)
            else:
                duration='{} mins {} secs'.format(minutes,seconds)
        elif hour==1:
            duration='{} hr {} mins'.format(hour,minutes)
        else:
            duration='{} hrs {} mins'.format(hour,minutes)
    elif day==1:
        duration='{} day {} hrs'.format(day,hour)
    else:
        duration='{} days {} hr'.format(day,hour)
    return {'day':day,'hour':hour,'minutes':minutes,'seconds':seconds,'duration':duration,'total_seconds':total_seconds}


@csrf_exempt
def getCodingTests(request,tid=0):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method == 'GET':
            test = Test.objects.get(id=tid)
            t1=CodingTestSerializer(CodingTest.objects.filter(type=1),many=True).data
            t2=CodingTestSerializer(CodingTest.objects.filter(type=2),many=True).data
            t3=CodingTestSerializer(CodingTest.objects.filter(type=3),many=True).data
            itemsType1={}
            itemsType2={}
            itemsType3={}
            if len(t1)>0:
                itemsType1=CodingTest.objects.get(id=list(random.sample(t1,1)[0].items())[0][1])
                itemsType1=CodingTestSerializer(itemsType1).data
            if len(t2)>0:
                itemsType2=CodingTest.objects.get(id=list(random.sample(t2,1)[0].items())[0][1])
                itemsType2=CodingTestSerializer(itemsType2).data
            if len(t3)>0:
                itemsType3=CodingTest.objects.get(id=list(random.sample(t3,1)[0].items())[0][1])
                itemsType3=CodingTestSerializer(itemsType3).data
            sub =Subject.objects.get(id=6)
            return JsonResponse({'time':test.c['time'],'cQs':[itemsType1,itemsType2,itemsType3]},safe=False)
    else:
        return HttpResponseBadRequest()

@csrf_exempt
def comprehension(request,tid=0):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method == 'GET':
            test = Test.objects.get(id=tid)
            sub = Subject.objects.get(id=5)
            paras = Para.objects.order_by('?')[:3]
            f=[]
            for para in paras:
                x={}
                x['title'] = para.title
                x['para'] = para.data
                questions = Paraqs.objects.filter(para=para)
                qs = []
                for question in questions:
                    op={}
                    options = Paraopt.objects.filter(paraqs=question)
                    op['question'] = question.title
                    op['options'] =OptionSerializer(options,many=True).data
                    qs.append(op)
                x['questions'] = qs 
                f.append(x)    
            return JsonResponse({'data':f,'time':test.aw['time']},safe=False)   
    else:
        return HttpResponseBadRequest()

@csrf_exempt
def deleteres(request,id):
    if request.method=="DELETE":
        try:
            Results.objects.get(id=id).delete()
        except:
            print("Error in Deleting the result object")    
        return JsonResponse("done",safe=False) 

@csrf_exempt
def personalityR(request):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method=='POST':
            return evaluate(request, CFG['DB'])
    else:
        return HttpResponseBadRequest()

@csrf_exempt
def feedback(request):
    if request.headers.get('Authorization') and checkAuthorization(request.headers["Authorization"]):
        if request.method=='POST':
            data=JSONParser().parse(request)['data']
            user=MyUser.objects.get(email=data['username'])
            feedback=Feedback.objects.filter(user=user)
            flag=False
            if feedback.exists():
                feedback=feedback[0]
                feedback.rating=data['rating']
                feedback.comment=data['comment']
                feedback.save()
                flag=True
            else:
                newFeedback=Feedback(user=user,rating=data['rating'],comment=data['comment'])
                newFeedback.save()
                flag=True
            return JsonResponse({'success':flag},safe=False)    
        elif request.method=="GET":
            users=User.objects.filter(is_staff=False)
            newArr=[]
            takeFeedback=True
            for user in users:
                myuser=user.myuser
                feedback=Feedback.objects.filter(user=myuser)
                takeFeedback=takeFeedback and myuser.takeFeedback
                if feedback.exists():
                    newDict={'email':myuser.email,'userId':myuser.id,'comment':feedback[0].comment,'rating':feedback[0].rating,'checkBtn':myuser.takeFeedback}
                else:
                    newDict={'email':myuser.email,'userId':myuser.id,'comment':'-','rating':'-','checkBtn':myuser.takeFeedback}
                newArr.append(newDict)
            return JsonResponse({'feedback_data':newArr,'takeFeedback':takeFeedback},safe=False)   
    else:
        return HttpResponseBadRequest()

def evaluate_api(request,data=0):
    """API endpoint."""
    if not data:
        data=JSONParser().parse(request)['data']

        # Extract identifying variables
        Sex = data['Sex']
        Age = int(data['Age'])
        Nick = data['Nick']
        Country = data['Country']
        
        # Get the item responses
        items = 121  # shortipipneo
        Q = [0] * (items)

        # for i in range(1, items):
        #     variable = "Q%d" % i
        #     Q[i] = data(variable, 0)
        Q[1]=data['Q1']
    else:
        # Extract identifying variables
        Sex = data['Sex']
        Age = int(data['Age'])
        Nick = data['Nick']
        Country = data['Country']
        
        # Get the item responses
        items = 121  # shortipipneo
        Q = [0] * (items)

        for i in range(1, items):
            if(len(data['Q'])>i):
                if data['Q'][i-1]!=-1:
                    Q[i]=data['Q'][i-1]
                else :
                    Q[i]=0
            else:
                Q[i]=(i-1)%2

    Q = list(map(int, Q))

    # Score facet scales
    ss = [0] * items
    for i in range(1, 31):
        k = 0
        for _ in range(0, 4):
            ss[i] += Q[i + k]
            k = k + 30

    # Number each facet set from 1-6
    NF = [0] * items
    EF = [0] * items
    OF = [0] * items
    AF = [0] * items
    CF = [0] * items
    j = 0
    for i in range(1, 7):
        NF[i] = ss[i + j]
        EF[i] = ss[i + j + 1]
        OF[i] = ss[i + j + 2]
        AF[i] = ss[i + j + 3]
        CF[i] = ss[i + j + 4]
        j = j + 4

    # Score domain scales
    #      1       2         3        4        5        6
    N = ss[1] + ss[6]  + ss[11] + ss[16] + ss[21] + ss[26]
    E = ss[2] + ss[7]  + ss[12] + ss[17] + ss[22] + ss[27]
    O = ss[3] + ss[8]  + ss[13] + ss[18] + ss[23] + ss[28]
    A = ss[4] + ss[9]  + ss[14] + ss[19] + ss[24] + ss[29]
    C = ss[5] + ss[10] + ss[15] + ss[20] + ss[25] + ss[30]

    # Standardize scores

    if Sex == "Male" and Age < 21:
        norm = (
                0, 67.84, 80.70, 85.98, 81.98, 79.66, 15.83, 15.37, 12.37, 14.66, 14.49,
            11.72, 11.93, 10.58, 12.38, 11.67,  9.63,  3.76,  4.41,  4.25,  3.83,  3.25, 3.38,
            13.76, 12.23, 14.06, 11.54, 14.67, 14.41,  3.78,  4.17,  3.66,  3.15,  3.38, 3.68,
            16.68, 14.51, 14.52, 12.84, 15.47, 11.86,  2.96,  3.87,  3.31,  3.16,  3.50, 3.17,
            13.18, 14.85, 15.37, 12.73, 12.01, 13.96,  3.69,  3.44,  3.10,  4.05,  3.94, 3.35,
            15.31, 10.97, 15.22, 13.61, 12.35, 12.08,  2.55,  3.93,  2.92,  3.65,  3.24, 4.02)
        Category = "males less than 21 years of age"

    if Sex == "Male" and Age > 20 and Age < 41:
        norm = (
                0, 66.97, 78.90, 86.51, 84.22, 85.50, 16.48, 15.21, 12.65, 13.10, 14.27,
            11.44, 11.75, 10.37, 12.11, 12.18,  9.13,  3.76, 4.30,   4.12,  3.81, 3.52, 3.48,
            13.31, 11.34, 14.58, 12.07, 13.34, 14.30,  3.80, 3.99,   3.58,  3.23, 3.43, 3.53,
            15.94, 14.94, 14.60, 13.14, 16.11, 11.66,  3.18, 3.63,   3.19,  3.39, 3.25, 3.72,
            12.81, 15.93, 15.37, 14.58, 11.43, 13.77,  3.69, 3.18,   2.92,  3.70, 3.57, 3.29,
            15.80, 12.05, 15.68, 15.36, 13.27, 13.31,  2.44, 4.26,   2.76,  3.39, 3.31, 4.03)
        Category = "men between 21 and 40 years of age"

    if Sex == "Male" and Age > 40 and Age < 61:
        norm = (
                0, 64.11, 77.06, 83.04, 88.33, 91.27, 16.04,  14.31, 13.05, 11.76, 13.35,
            10.79, 11.60,  9.78, 11.85, 11.24,  8.81,  3.56,  4.16,  3.94,  3.62,   3.55, 3.35,
            13.22, 10.45, 14.95, 12.27, 11.82, 14.32,  3.71,  3.68,  3.44,  3.30,   3.23, 3.29,
            14.65, 14.66, 14.76, 12.69, 15.40, 11.04,  3.35,  3.59,  3.02,  3.44,   3.43, 3.93,
            13.42, 16.94, 15.65, 15.66, 11.96, 14.21,  3.49,  2.83,  2.88,  3.33,   3.34, 3.17,
            16.19, 13.33, 16.56, 16.51, 14.05, 14.60,  2.25,  4.32,  2.50,  2.93,   3.13, 3.78)
        Category = "men between 41 and 60 years of age"

    if Sex == "Male" and Age > 60:
        norm = (
               0,  58.42, 79.73, 79.78, 90.20, 95.31, 15.48, 13.63, 12.21, 11.73, 11.99,
             9.81, 11.46,  8.18, 11.08,  9.91,  8.24,  3.54,  4.31,  3.59,  3.82,  3.36, 3.28,
            14.55, 11.19, 15.29, 12.81, 11.03, 15.02,  3.47,  3.58,  3.10,  3.25,  2.88, 3.16,
            14.06, 14.22, 14.34, 12.42, 14.61, 10.11,  3.13,  3.64,  2.90,  3.20,  3.89, 4.02,
            13.96, 17.74, 15.76, 16.18, 11.87, 14.00,  3.13,  2.39,  2.74,  3.41,  3.50, 3.11,
            16.32, 14.41, 17.54, 16.65, 14.98, 15.18,  2.31,  4.49,  2.30,  2.68,  2.76, 3.61)
        Category = "men over 60 years of age"

    if Sex == "Female" and Age < 21:
        norm = (
            0,     73.41, 84.26, 89.01, 89.14, 81.27, 15.61, 14.98, 11.84,  13.21, 14.38,
            13.31, 13.09, 11.05, 12.11, 12.48, 11.30,  3.62,  4.18,  4.20,  3.82,  3.30, 3.47,
            14.47, 13.12, 14.03, 12.67, 14.69, 15.34,  3.60,  4.13,  3.68,  3.09,  3.48, 3.42,
            16.86, 15.93, 16.02, 12.95, 15.06, 12.17,  2.89,  3.44,  2.95,  3.24,  3.51, 3.02,
            13.46, 16.11, 16.66, 13.73, 13.23, 15.70,  3.72,  2.94,  2.69,  4.14,  3.79, 2.84,
            15.30, 11.11, 15.62, 14.69, 12.73, 11.82,  2.54,  4.17,  2.76,  3.37,  3.19, 4.01)

        Category = "females less than 21 years of age"

    if Sex == "Female" and Age > 20 and Age < 41:
        norm = (
               0,  72.14, 80.78, 88.25, 91.91, 87.57, 16.16, 14.64, 12.15, 11.39, 13.87,
            13.08, 12.72, 10.79, 12.20, 12.71, 10.69,  3.68,  4.13,  4.07,  3.79,  3.58, 3.64,
            14.05, 11.92, 14.25, 12.77, 12.84, 14.96,  3.66,  4.05,  3.61,  3.24,  3.53, 3.31,
            15.64, 15.97, 16.41, 12.84, 15.28, 12.06,  3.34,  3.30,  2.69,  3.44,  3.47, 3.46,
            13.15, 17.34, 16.81, 15.57, 12.98, 15.52,  3.71,  2.61,  2.53,  3.50,  3.57, 2.87,
            16.02, 12.67, 16.36, 16.11, 13.56, 12.91,  2.34,  4.51,  2.54,  3.05,  3.23, 4.18)

        Category = "women between 21 and 40 years of age"

    if Sex == "Female" and Age > 40 and Age < 61:
        norm = (
                0, 67.38, 78.62, 86.15, 95.73, 93.45, 16.10, 14.19, 12.62, 9.84, 12.94,
            12.05, 11.19, 10.07, 12.07, 11.98, 10.07,  3.72,  4.03,  3.97, 3.73, 3.69, 3.56,
            14.10, 10.84, 14.51, 13.03, 11.08, 15.00,  3.72,  3.86,  3.50, 3.46, 3.42, 3.26,
            14.43, 16.00, 16.37, 12.58, 14.87, 11.85,  3.49,  3.20,  2.58, 3.45, 3.65, 3.74,
            13.79, 18.16, 17.04, 17.02, 13.41, 15.82,  3.52,  2.21,  2.40, 2.88, 3.30, 2.71,
            16.50, 13.68, 17.29, 17.16, 14.35, 14.41,  2.16,  4.51,  2.27, 2.73, 3.13, 3.86)

        Category = "women between 41 and 60 years of age"

    if Sex == "Female" and Age > 60:
        norm = (
            0,     63.48, 78.22, 81.56, 97.17, 96.44, 14.92, 12.73, 12.66, 9.52,  12.43,
            11.39, 10.52,  9.10, 12.00, 10.21,  9.87,  3.61,  3.82,  3.68, 3.61,  3.58, 3.44,
            14.85, 10.93, 14.19, 12.76, 10.08, 15.65,  3.43,  3.70,  3.64, 3.26,  3.20, 3.04,
            13.15, 15.95, 15.73, 11.80, 14.21, 10.81,  3.71,  3.12,  2.74, 3.26,  3.47, 3.89,
            14.19, 18.64, 17.13, 17.98, 13.58, 15.83,  3.39,  1.90,  2.18, 2.56,  3.38, 2.85,
            16.50, 15.15, 18.34, 17.19, 14.70, 15.11,  2.24,  4.07,  1.81, 2.49,  3.15, 3.66)

        Category = "women over 60 years of age"

    SN = (10 * (N - norm[1]) / norm[6]) + 50
    SE = (10 * (E - norm[2]) / norm[7]) + 50
    SO = (10 * (O - norm[3]) / norm[8]) + 50
    SA = (10 * (A - norm[4]) / norm[9]) + 50
    SC = (10 * (C - norm[5]) / norm[10]) + 50

    SNF = [0] * items
    SEF = [0] * items
    SOF = [0] * items
    SAF = [0] * items
    SCF = [0] * items

    for i in range(1, 7):
        SNF[i] = 50 + (10 * (NF[i] - norm[i + 10]) / norm[i + 16])
        SEF[i] = 50 + (10 * (EF[i] - norm[i + 22]) / norm[i + 28])
        SOF[i] = 50 + (10 * (OF[i] - norm[i + 34]) / norm[i + 40])
        SAF[i] = 50 + (10 * (AF[i] - norm[i + 46]) / norm[i + 52])
        SCF[i] = 50 + (10 * (CF[i] - norm[i + 58]) / norm[i + 64])

    # Cubic approximations for percentiles

    CONST1 = 210.335958661391
    CONST2 = 16.7379362643389
    CONST3 = 0.405936512733332
    CONST4 = 0.00270624341822222

    SNP = int(CONST1 - (CONST2 * SN) + (CONST3 * SN ** 2) - (CONST4 * SN ** 3))
    SEP = int(CONST1 - (CONST2 * SE) + (CONST3 * SE ** 2) - (CONST4 * SE ** 3))
    SOP = int(CONST1 - (CONST2 * SO) + (CONST3 * SO ** 2) - (CONST4 * SO ** 3))
    SAP = int(CONST1 - (CONST2 * SA) + (CONST3 * SA ** 2) - (CONST4 * SA ** 3))
    SCP = int(CONST1 - (CONST2 * SC) + (CONST3 * SC ** 2) - (CONST4 * SC ** 3))

    if SN < 32:
        SNP = 1
    if SE < 32:
        SEP = 1
    if SO < 32:
        SOP = 1
    if SA < 32:
        SAP = 1
    if SC < 32:
        SCP = 1

    if SN > 73:
        SNP = 99
    if SE > 73:
        SEP = 99
    if SO > 73:
        SOP = 99
    if SA > 73:
        SAP = 99
    if SC > 73:
        SCP = 99

    # Create percentile scores and low, average, high labels for facets
    SNFP = [0] * items
    SEFP = [0] * items
    SOFP = [0] * items
    SAFP = [0] * items
    SCFP = [0] * items

    flev = [0] * items
    for i in range(1, 7):
        flev[i] = SNF[i]
        if SNF[i] < 45:
            flev[i] = "low"

        if SNF[i] >= 45 and SNF[i] <= 55:
            flev[i] = "average"

        if SNF[i] > 55:
            flev[i] = "high"

        SNFP[i] = int(CONST1 - (CONST2 * SNF[i]) + (CONST3 * SNF[i] ** 2) -
                      (CONST4 * SNF[i] ** 3))

        if SNF[i] < 32:
            SNFP[i] = 1

        if SNF[i] > 73:
            SNFP[i] = 99

    for i in range(1, 7):
        flev[i + 6] = SEF[i]
        if SEF[i] < 45:
            flev[i + 6] = "low"

        if SEF[i] >= 45 and SEF[i] <= 55:
            flev[i + 6] = "average"

        if SEF[i] > 55:
            flev[i + 6] = "high"

        SEFP[i] = int(CONST1 - (CONST2 * SEF[i]) + (CONST3 * SEF[i] ** 2) -
                      (CONST4 * SEF[i] ** 3))

        if SEF[i] < 32:
            SEFP[i] = 1
        if SEF[i] > 73:
            SEFP[i] = 99

    for i in range(1, 7):
        flev[i + 12] = SOF[i]
        if SOF[i] < 45:
            flev[i + 12] = "low"

        if SOF[i] >= 45 and SOF[i] <= 55:
            flev[i + 12] = "average"

        if SOF[i] > 55:
            flev[i + 12] = "high"

        SOFP[i] = int(CONST1 - (CONST2 * SOF[i]) + (CONST3 * SOF[i] ** 2) -
                      (CONST4 * SOF[i] ** 3))

        if SOF[i] < 32:
            SOFP[i] = 1
        if SOF[i] > 73:
            SOFP[i] = 99

    for i in range(1, 7):
        flev[i + 18] = SAF[i]
        if SAF[i] < 45:
            flev[i + 18] = "low"

        if SAF[i] >= 45 and SAF[i] <= 55:
            flev[i + 18] = "average"

        if SAF[i] > 55:
            flev[i + 18] = "high"

        SAFP[i] = int(CONST1 - (CONST2 * SAF[i]) + (CONST3 * SAF[i] ** 2) -
                      (CONST4 * SAF[i] ** 3))

        if SAF[i] < 32:
            SAFP[i] = 1
        if SAF[i] > 73:
            SAFP[i] = 99

    for i in range(1, 7):
        flev[i + 24] = SCF[i]
        if SCF[i] < 45:
            flev[i + 24] = "low"
        if SCF[i] >= 45 and SCF[i] <= 55:
            flev[i + 24] = "average"
        if SCF[i] > 55:
            flev[i + 24] = "high"

        SCFP[i] = int(CONST1 - (CONST2 * SCF[i]) + (CONST3 * SCF[i] ** 2) -
                      (CONST4 * SCF[i] ** 3))

        if SCF[i] < 32:
            SCFP[i] = 1
        if SCF[i] > 73:
            SCFP[i] = 99

    LO = 45
    HI = 55

    if "results_api" not in request.build_absolute_uri('?'):  # hack
        return SEP, SEFP, LO, HI, SE, SAP, SAFP, SA, SC, SCP, SCFP, flev, SOP, \
                SOFP, SO, Nick, Country, SNP, SNFP, Category, SN, Sex, Age, Q
    else:  # treat as an api call.
        m = {}

        labels = ['EXTRAVERSION', 'Friendliness', 'Gregariousness', 'Assertiveness', 'Activity Level', 'Excitement-Seeking', 'Cheerfulness']
        m[labels[0]] = SEP
        for i in range(1, len(labels)):
            m[labels[i]] = SEFP[i]

        labels =  ['AGREEABLENESS', 'Trust', 'Morality', 'Altruism', 'Cooperation', 'Modesty', 'Sympathy']
        m[labels[0]] = SAP
        for i in range(1, len(labels)):
            m[labels[i]] = SAFP[i]

        labels = ['CONSCIENTIOUSNESS', 'Self-Efficacy', 'Orderliness', 'Dutifulness', 'Achievement-Striving', 'Self-Discipline', 'Cautiousness']
        m[labels[0]] = SCP
        for i in range(1, len(labels)):
            m[labels[i]] = SCFP[i]

        labels = ['NEUROTICISM', 'Anxiety', 'Anger', 'Depression', 'Self-Consciousness', 'Immoderation', 'Vulnerability']
        m[labels[0]] = SNP
        for i in range(1, len(labels)):
            m[labels[i]] = SNFP[i]

        labels = ['OPENNESS', 'Imagination', 'Artistic Interests', 'Emotionality', 'Adventurousness', 'Intellect', 'Liberalism']
        m[labels[0]] = SOP
        for i in range(1, len(labels)):
            m[labels[i]] = SOFP[i]

        # od = collections.OrderedDict(sorted(m.items()))
        return json.dumps(m)


def evaluate(request, data=0):

    """Personality evaluation logic."""

    SEP, SEFP, LO, HI, SE, SAP, SAFP, SA, SC, SCP, SCFP, flev, SOP, SOFP, SO, \
            Nick, Country, SNP, SNFP, Category, SN, Sex, Age, Q = evaluate_api(request,data)

    # Save Data
    a={}
    a['SEP']=SEP
    if not data:
        return JsonResponse({'data':{'SEP':SEP, 'SEFP':SEFP,
            'LO':45, 'HI':55, 'SE':SE, 'SAP':SAP, 'SAFP':SAFP, 'SA':SA,
            'SC':SC, 'SCP':SCP, 'SCFP':SCFP, 'flev':flev,
            'SOP':SOP, 'SOFP':SOFP,
            'SO':SO, 'Nick':Nick, 'Country':Country,
            'SNP':SNP, 'SNFP':SNFP, 'Category':Category,
            'SN':SN}},safe=False)
    else:
        return ({'SEP':SEP, 'SEFP':SEFP,
            'LO':45, 'HI':55, 'SE':SE, 'SAP':SAP, 'SAFP':SAFP, 'SA':SA,
            'SC':SC, 'SCP':SCP, 'SCFP':SCFP, 'flev':flev,
            'SOP':SOP, 'SOFP':SOFP,
            'SO':SO, 'Nick':Nick, 'Country':Country,
            'SNP':SNP, 'SNFP':SNFP, 'Category':Category,
            'SN':SN})
