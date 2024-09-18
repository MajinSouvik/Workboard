from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from User.serializers import RegistrationSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken, TokenError
from User.serializers import UserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    """
    Fetch all registered users.
    Only authenticated users can access this endpoint.
    """
    try:
        users = User.objects.all()  # Fetch all users
        serializer = UserSerializer(users, many=True)  # Serialize all users
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized user data
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def register_user(request):
    serializer = RegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Login(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
        except Exception as e:
            print(request.data)
            print("-->",e)
        tokens = response.data 
        
        user=User.objects.get(username=request.data.get('username'))
        user_serializer = UserSerializer(user)
        
        resp={
            'access_token':tokens['access'],
            'refresh_token':tokens['refresh'],
            'user':user_serializer.data
        }
        
        response = Response(resp, status=status.HTTP_200_OK)
        
        response.set_cookie(
            key='access_token',
            value=tokens['access'],
            httponly=True,
            secure=True,
            samesite='Lax'
        )
        
        response.set_cookie(
            key='refresh_token',
            value=tokens['refresh'],
            httponly=True,
            secure=True,  
            samesite='Lax'
        )
        return response

    
    