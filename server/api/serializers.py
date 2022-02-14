from rest_framework import serializers
from .models import CodingTest, MyUser, Results, Subject,Questions,Test,Paraopt,Para
from django.contrib.auth.models import User

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields='__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questions
        fields='__all__'     

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields='__all__'      
class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Results
        fields='__all__'      
class CodingTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodingTest
        fields='__all__'      
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paraopt
        fields='__all__'  

class ParaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Para
        fields='__all__'     
class MyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields='__all__'     
class AllUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields='__all__'     