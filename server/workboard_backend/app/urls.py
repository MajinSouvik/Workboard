from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app.views import WorkBoardViewSet

# Create a router and register the viewset
router = DefaultRouter()
router.register('workboard', WorkBoardViewSet, basename='workboard')

# Include the router-generated URLs in your main urls.py
urlpatterns = [
    path('', include(router.urls))
]
