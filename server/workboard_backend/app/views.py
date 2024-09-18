from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from app.models import WorkBoard, Task
from app.serializers import WorkBoardSerializer
from rest_framework.permissions import IsAuthenticated

class WorkBoardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        user = request.user
        queryset = WorkBoard.objects.filter(tasks__assigned_to=user).distinct()
        serializer = WorkBoardSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = WorkBoardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            workboard = WorkBoard.objects.get(pk=pk)
        except WorkBoard.DoesNotExist:
            return Response({'detail': 'WorkBoard not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = WorkBoardSerializer(workboard, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
