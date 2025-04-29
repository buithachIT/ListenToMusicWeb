from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from .models import Users 
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny 

# Sự kiện đăng ký người dùng
class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Đăng ký thành công!", "status":status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED)
        return Response({"message": serializer.errors, "status" :status.HTTP_400_BAD_REQUEST})
    
# Sự kiện đăng nhập người dùng    
from .serializers import LoginSerializer
class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']

            # Tạo refresh và access token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            # Lưu vào DB nếu muốn
            user.accesstoken = access_token
            user.refreshtoken = refresh_token
            user.save()

            # Tạo response
            response = Response({
                "data": {
                    "access_token": access_token,
                    "users": {
                        "id": user.id,
                        "user_name": user.user_name,
                        "email": user.email,
                        "role_id": user.role_id,
                        "is_superuser": user.is_superuser,
                        "url_avatar": user.url_avatar
                    }
                },
                "message": "Đăng nhập thành công!",
                "errors": None,
            }, status=status.HTTP_200_OK)

            # Gắn refresh_token vào cookie HTTPOnly
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=True,               # Trong môi trường dev có thể để False
                samesite='Lax',
                max_age=7 * 24 * 60 * 60,  # 7 ngày
                path='/' 
            )
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        print("🔎 Refresh token nhận được:", refresh_token)

        if not refresh_token:
            return Response({'error': 'No refresh token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            print("✅ Token giải mã OK")
            print("➡️ Payload:", token.payload)

            access_token = str(token.access_token)

            user = Users.objects.get(id=token['user_id'])
            user.accesstoken = access_token
            user.save()

            response = Response({'access_token': access_token}, status=status.HTTP_200_OK)
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='Lax',
                max_age=7 * 24 * 60 * 60,
                path='/'
            )
            return response

        except Exception as e:
            print("❌ Token error:", str(e))  # Log chính xác lỗi
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class UpdateUserView(APIView):
    def put(self, request, pk):
        try:
            user = Users.objects.get(pk=pk)
        except Users.DoesNotExist:
            return Response({"message": "Người dùng không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Cập nhật người dùng thành công!", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response({"message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# Xóa người dùng
class DeleteUserView(APIView):
    def delete(self, request, pk):
        try:
            user = Users.objects.get(pk=pk)
        except Users.DoesNotExist:
            return Response({"message": "Người dùng không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response({"message": "Xóa người dùng thành công!"}, status=status.HTTP_204_NO_CONTENT)

#Lấy ra danh sách người dùng   
class ListUsersView(APIView):
    def get(self, request):
        users = Users.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({"data": serializer.data, "message": "Lấy danh sách người dùng thành công!"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def GetUserbyIdView(request, id):
    users = Users.objects.filter(id=id)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def GetUserbyTokenView(request, accesstoken):
    users = Users.objects.filter(accesstoken=accesstoken)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(request.headers)  # DEBUG

        user = request.user  # Django tự lấy user từ access_token trong header

        return Response({
            "data":{
            "user":{
            "id": user.id,
            "fullname":user.fullname,
            "user_name": user.user_name,
            "email": user.email,
            "role_id": user.role_id,
            "is_superuser": user.is_superuser,
            "url_avatar": user.url_avatar}}
        })
# Đăng xuất người dùng
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user

            # Xóa access_token và refresh_token lưu trong DB (nếu có)
            user.accesstoken = ''
            user.refreshtoken = ''
            user.save()

            # Xóa cookie refresh_token ở trình duyệt
            response = Response({
                "message": "Đăng xuất thành công!"
            }, status=status.HTTP_200_OK)
            response.delete_cookie('refresh_token')

            return response
        except Exception as e:
            return Response({
                "error": "Có lỗi xảy ra trong quá trình đăng xuất.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)