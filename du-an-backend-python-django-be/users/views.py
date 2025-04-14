from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from .models import Users 
<<<<<<< HEAD
=======
from rest_framework.decorators import api_view
>>>>>>> bcd161744d1fcd440b67199d4c12899411df4d0d

# Sự kiện đăng ký người dùng
class RegisterUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Đăng ký thành công!", "status":status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED)
        return Response({"message": serializer.errors, "status" :status.HTTP_400_BAD_REQUEST})
    
# Sự kiện đăng nhập người dùng    
from .serializers import LoginSerializer
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response({
                "data":{
<<<<<<< HEAD
                    "user":{
=======
>>>>>>> bcd161744d1fcd440b67199d4c12899411df4d0d
                "user_id": user.user_id,
                "user_name": user.user_name,
                "email": user.email,
                "role_id": user.role_id,
<<<<<<< HEAD
                    }
=======
>>>>>>> bcd161744d1fcd440b67199d4c12899411df4d0d
                },
                "message": "Đăng nhập thành công!",
                "errors": status.HTTP_200_OK,            
                # Thêm các thông tin khác nếu cần
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# views.py
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
<<<<<<< HEAD
class CurrentUserMockTokenView(APIView):
    def get(self, request):
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '')

        # Hardcode token là "a"
        if token != 'a':
            return Response({"message": "Token không hợp lệ."}, status=status.HTTP_401_UNAUTHORIZED)

        # Hardcode giả lập user đang đăng nhập là user id = 1 (hoặc user nào đó anh chọn)
        try:
            user = Users.objects.get(pk=1)
        except Users.DoesNotExist:
            return Response({"message": "Không tìm thấy người dùng."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)
        return Response({
            "data": serializer.data,
            "message": "Lấy thông tin người dùng thành công!"
        }, status=status.HTTP_200_OK)
=======
class ListUsersView(APIView):
    def get(self, request):
        users = Users.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({"data": serializer.data, "message": "Lấy danh sách người dùng thành công!"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def GetUserbyIdView(request, user_id):
    users = Users.objects.filter(user_id=user_id)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def GetUserbyTokenView(request, accesstoken):
    users = Users.objects.filter(accesstoken=accesstoken)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
>>>>>>> bcd161744d1fcd440b67199d4c12899411df4d0d
