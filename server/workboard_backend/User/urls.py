from django.urls import path
from User.views import register_user, Login, get_all_users, get_user_by_id
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register_user, name='registration'),
    path('users/', get_all_users, name='get_all_users'),
    path('users/<int:user_id>/', get_user_by_id, name='get_user_by_id'),
    path('api/token/', Login.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]