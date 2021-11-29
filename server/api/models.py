from django.db import models

class Questions(models.Model):
    title = models.CharField(max_length=255)
    type = models.IntegerField()
    def __str__(self):
        return self.title

class Options(models.Model):
    question = models.ForeignKey(Questions,on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    marks = models.IntegerField()  
    def __str__(self):
        return self.title +' '+ self.question
