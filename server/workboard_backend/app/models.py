from django.db import models
from django.contrib.auth.models import User  # Import the built-in User model

# Task Model
class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    assigned_to = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=50, default='ToDo')
    workboard = models.ForeignKey('WorkBoard', related_name='tasks', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

# WorkBoard Model
class WorkBoard(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

