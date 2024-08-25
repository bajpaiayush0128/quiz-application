from django.contrib import admin
from .models import Role, CustomUser, Quiz, Question, Result
# Register your models here.

admin.site.register(Role)
admin.site.register(CustomUser)
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Result)