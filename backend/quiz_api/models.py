from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import AbstractUser
# Create your models here.

class Role(models.Model):
    name = models.CharField(max_length=100)
    permission = ArrayField(models.CharField(max_length=100))

    def __str__(self):
        return self.name
    
class CustomUser(AbstractUser):
    role = models.ForeignKey(Role, on_delete=models.CASCADE, null=True)

class Quiz(models.Model):
    title = models.CharField(max_length=200)
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    pass_percent = models.IntegerField(default=50)
    quiz_duration = models.IntegerField(default=30)
    total_marks = models.IntegerField(default=0)
    total_ques = models.IntegerField(default=0)

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    desc = models.TextField()
    options = ArrayField(models.CharField(max_length=200))
    correct = models.CharField(max_length=200)
    marks = models.IntegerField()

class Result(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    correct_ques = models.IntegerField(default=0)
    result = models.IntegerField()