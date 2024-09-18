from rest_framework import serializers
from app.models import Task, WorkBoard
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)  # ID is optional for new tasks
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'assigned_to',  'status']


class WorkBoardSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    tasks = TaskSerializer(many=True)

    class Meta:
        model = WorkBoard
        fields = ['id', 'title', 'description', 'tasks']

    def create(self, validated_data):
        tasks_data = validated_data.pop('tasks', [])
        workboard = WorkBoard.objects.create(**validated_data)

        for task_data in tasks_data:
            Task.objects.create(workboard=workboard, **task_data)

        return workboard

    def update(self, instance, validated_data):
        tasks_data = validated_data.pop('tasks', [])
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        existing_task_ids = [task.id for task in instance.tasks.all()]
        new_task_ids = []

        for task_data in tasks_data:
            task_id = task_data.get('id')
            if task_id and task_id in existing_task_ids:
                task = Task.objects.get(id=task_id, workboard=instance)
                task.title = task_data.get('title', task.title)
                task.description = task_data.get('description', task.description)
                task.assigned_to = task_data.get('assigned_to', task.assigned_to)
                task.status = task_data.get('status', task.status)
                task.save()
                new_task_ids.append(task_id)
            else:
                new_task = Task.objects.create(workboard=instance, **task_data)
                new_task_ids.append(new_task.id)

        for task in instance.tasks.all():
            if task.id not in new_task_ids:
                task.delete()

        return instance
