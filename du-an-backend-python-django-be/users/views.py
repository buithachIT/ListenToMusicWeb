from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from .models import Users 

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
                "user_id": user.user_id,
                "user_name": user.user_name,
                "email": user.email,
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
class ListUsersView(APIView):
    def get(self, request):
        users = Users.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({"data": serializer.data, "message": "Lấy danh sách người dùng thành công!"}, status=status.HTTP_200_OK)

