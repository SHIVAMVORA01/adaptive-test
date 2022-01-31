import json
from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework.views import APIView
from api.models import Questions,Options,Results,Subject,Test,CodingTest,Para,Paraopt,Paraqs
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt 
from django.contrib.auth.models import User
import datetime
from rest_framework.parsers import JSONParser
import random
from .serializers import CodingTestSerializer, SubjectSerializer,QuestionSerializer, TestSerializer ,ResultSerializer,OptionSerializer
import math
from django.db.models import Q
CFG = {'DB': None}

@csrf_exempt
def subqs(request,subject=0):

    print(subject)
    print(int(subject)==4)
    print('(((((((((')
    if request.method == 'GET': 
        a=[]
        b=[]
        c=[]
        sub =Subject.objects.get(id=subject)
        qs = Questions.objects.filter(subject=sub)
        if int(subject)!=4:
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
            
            return JsonResponse({'qs':sub.sub_qs,'time':sub.sub_time,'easy':a,'medium':b,'hard':c},safe=False)
        elif int(subject)==4:
            for x in qs:
                aa={}
                aa['ques']=x.title
                aa['id']=x.id
                a.append(aa)
            return JsonResponse({'qs':sub.sub_qs,'time':sub.sub_time,'allQs':a},safe=False)

@csrf_exempt
def subs(request):
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
            print(c)
            print('&&&&&&&&&&&&&&&')
            if c['type']==1:
                f['Coding']['easy'].append(c)
            elif c['type']==2:
                f['Coding']['medium'].append(c)
            elif c['type']==3:
                f['Coding']['hard'].append(c)
        qs=Questions.objects.all()
        for q in qs:
            a={}
            
            if q.subject.sub_name!='Coding':
                a['ques']=q.title
                a['id']=q.id
                a['options']=[]
                opts=Options.objects.filter(question=q)
                for opt in opts:
                    o={}
                    o['opt']=opt.title
                    o['id']=opt.id
                    o['mrks']=opt.marks
                    a['options'].append(o)
                if q.type==1:
                    f[str(q.subject)]['easy'].append(a)
                if q.type==2:
                    f[str(q.subject)]['medium'].append(a)
                elif q.type==3:
                    f[str(q.subject)]['hard'].append(a)
        
        

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
    user = User.objects.get(username = name) 
    if request.method == 'POST':
        data=JSONParser().parse(request)['data']
        if(user):
            d = datetime.datetime.utcnow()
            try:
                if name != 'a':
                    rr=Results.objects.get(student = user,test=Test.objects.get(id=data['testId']))
                    if rr:
                        return JsonResponse({'resultExists':True},safe=False)
                else:
                    Results.objects.get(student = user,test=Test.objects.get(id=data['testId'])).delete()
            except Results.DoesNotExist:
                print('No previous entry')
            result = Results.objects.create(student = user,startTime = d.time(),test=Test.objects.get(id=data['testId']),
            marks={"ap":0,'cf':0,'c':0,'d':0,'p':0,'a':0,'apMax':[],'cfMax':[],'cMax':[],'dMax':[],'pMax':[],'aMax':[],'apGot':[],'cfGot':[],'cGot':[],'dGot':[],'pGot':[],'aGot':[]}
            )
            result.save()
            return JsonResponse({'resultExists':False},safe=False)
        else:
            return JsonResponse("User Doesn't exist",safe=False)
    elif request.method=='GET':
        if user:
            testId=request.GET.get('testId')
            data=chartData(user,testId)
            
            return JsonResponse(data,safe=False)

def chartData(user,testId=-1):
    totalQs=0
    subs=Subject.objects.all()
    a=[]
    aa={}
    mrksScored=[]
    mrksScoredPercent=[]
    for sub in subs:
        if sub.sub_name!='Personality':
            totalQs+=sub.sub_qs
            avgMarks=sub.sub_qs*2*0.7 # 70% average
            avgMarks=math.ceil(avgMarks)
            aa[sub.sub_name]=avgMarks
    a=[aa['Aptitude'],aa['Computer Fundamentals'],aa['Domain'],aa['Coding'],aa['Analytical Writing']]
    try:
        resl=Results.objects.get(student = user,test=Test.objects.get(id=testId))
        apMax=1
        cfMax=1
        dMax=1
        pMax=1
        aMax=1
        cMax=1
        print('-----------')
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

        print(tdelta.seconds)
    except Results.DoesNotExist:
        print('No previous entry')
        resl=0
    return {'startTime':resl.startTime,'endTime':resl.endTime,'personalityData':resl.marks['pGot'],'marks':resl.marks,'totalQs':totalQs,'avgMarksArr':a,'mrksScored':mrksScored,'mrksScoredPercent':mrksScoredPercent,'totalMarksScored':sum(mrksScored),'timeTaken':tdelta.seconds}

@csrf_exempt
def resultTest(request,id):
    testData=Results.objects.filter(test=Test.objects.get(id=id))
    a={}
    a=ResultSerializer(testData,many=True)
    
    cc=[]
    for x in a.data:
        c={}
        print(x)
        c['name']=User.objects.get(id=x['student']).username
        c['sdate']=x['startTime'].split('.')[0]
        c['edate']=x['endTime'].split('.')[0]
        c['marks']=x['marks']['ap']+x['marks']['cf']+x['marks']['c']+x['marks']['d']+x['marks']['p']+x['marks']['a']
        cc.append(c)

    return JsonResponse({'testData':a.data,'studentNameArr':cc},safe=False)


@csrf_exempt        
def marks(request,sid=0):
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
                    print('***************************')
                    print(data['marks'])
                    print('***************************')
                    result.marks['pGot']=[evaluate(request,{'Nick':data['username'],'Sex':'Male','Age':21,'Q':data['marks'],'Country':'India'})]
                elif sid == 6:
                    result.marks['a'] = data['marks'] 
                    result.marks['aMax'] = data['maxMarks']
                    result.marks['aGot'] = data['gotMarks']
                    
                else:
                    print('**error**')
                    return JsonResponse("Error",safe=False)
                result.endTime = d.time()
                result.save()
                data=chartData(user,data['testId'])
                return JsonResponse(data,safe=False)
            else:
                return JsonResponse("Restart Test",safe=False)
        else:
            return JsonResponse("User Doesn't exist",safe=False)  
@csrf_exempt        
def addQs(request):
    if request.method == 'POST':
        data=JSONParser().parse(request)['data']
        if str(data['sectionName'])!='Coding':
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
        else:
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
        return JsonResponse("Done",safe=False) 

@csrf_exempt
def delQs(request):
    if request.method == 'POST':
        data=JSONParser().parse(request)['data']
        print(data)
        sid=int(data['sid'])
        for x in data['delQs']:
            if sid != 5:
                Questions.objects.get(id=x).delete()
            elif sid==5:
                CodingTest.objects.get(id=x).delete()
        return JsonResponse('success',safe=False)
@csrf_exempt
def saveTest(request):
    if request.method == 'POST':
        data=JSONParser().parse(request)['data']
        print(data['saveTest'])
        print(data['createTest'])
       
        tst=Test(test_name=data['createTest']['testName'],test_start=data['createTest']['sTime'],test_end=data['createTest']['eTime'])
        print(tst.test_start)
        tst.save()

        for x in range(0,len(data['saveTest'])):
            print(data['savetest'][x]['sub'])
            avgMrk=0
            if str(data['savetest'][x]['sub'])=='Coding' or str(data['savetest'][x]['sub'])=='Analytical Writing':
                avgMrk=30
            else:
                avgMrk=math.ceil(int(data['saveTest'][x]['totalQs'])*2*0.7) # 70% average
            b=Subject.objects.get(sub_name=data['saveTest'][x]['sub'])
            b.sub_qs=data['saveTest'][x]['totalQs']
            b.sub_time=data['saveTest'][x]['time']
            b.avg_score=avgMrk
            b.save()
        return JsonResponse('success',safe=False)

@csrf_exempt
def tests(request):
    if request.method == 'GET':
        d = datetime.datetime.utcnow()
        print(d)
        ll=Test.objects.filter(test_start__lte = d,test_end__gte=d)
        if(ll.exists()):
            return JsonResponse({'testId':ll[0].id},safe=False)
        else:
            return JsonResponse({'testId':-1},safe=False)    

    elif request.method == 'POST':
        data=JSONParser().parse(request)['data']
        if not data['delete']:
            if not data['update']:
                test = Test.objects.create(test_name =data['name'],test_start=data['start'],test_end=data['end'])
                test.save()
            else:
                test=Test.objects.get(id=data['id'])
                test.test_name=data['name']
                test.test_start=data['start']
                test.test_end=data['end']
                test.save()
        else:
            Test.objects.get(id=data['id']).delete()
        return JsonResponse('Created',safe=False)

@csrf_exempt    
def getTests(request):
    if request.method == 'GET':
        d = datetime.datetime.utcnow()
        stests = Test.objects.filter(Q(test_end__lte=d) | Q(test_start__lt=d))
        utests = Test.objects.filter(test_start__gt=d) 
        print(stests)
        stestS = TestSerializer(stests,many=True)
        utestS = TestSerializer(utests,many=True)
        return JsonResponse({"stests":stestS.data,"utests":utestS.data},safe=False)


@csrf_exempt
def getCodingTests(request):
    if request.method == 'GET':
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
        return JsonResponse({'time':sub.sub_time,'cQs':[itemsType1,itemsType2,itemsType3]},safe=False)
@csrf_exempt
def comprehension(request):
    if request.method == 'GET':
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
        return JsonResponse({'data':f,'time':sub.sub_time},safe=False)   



@csrf_exempt
def personalityR(request):
    if request.method=='POST':
        return evaluate(request, CFG['DB'])

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
        print('$$$$$$$$$$$$$$$$$$$')
        print(data)
        print('$$$$$$$$$$$$$$$$$$$')
        Sex = data['Sex']
        Age = int(data['Age'])
        Nick = data['Nick']
        Country = data['Country']
        print(data['Q'])
        print('@@@@@@@@@@@@@')
        
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
        print(Q)


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

    # Check sex and age
    if Sex != "Male" and Sex != "Female":
        return """You did not indicate your sex at the beginning of the
    inventory. Your answers cannot be normed properly unless you indicate
    whether you are male or female. Please return to the inventory and indicate
    your sex."""

    if Age < 10:
        return """You did not indicate how old you are at the beginning of the
    inventory, or you typed in an age that is too young. Your answers cannot be
    normed properly unless type in a valid age. Please return to the inventory
    and change your response."""

    # Save Data
    print(type(SEP))
    print('*****************')
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
