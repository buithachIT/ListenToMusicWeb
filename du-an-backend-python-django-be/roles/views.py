from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Roles
from .serializers import RoleSerializer
from django.shortcuts import get_object_or_404

class CreateRoleView(APIView):
    def post(self, request):
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Tạo vai trò thành công!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "message": "Tạo vai trò thất bại!",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
# Xem danh sách tất cả Role
class RoleListView(APIView):
    def get(self, request):
        roles = Roles.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)

# Sửa thông tin Role
class RoleUpdateView(APIView):
    def put(self, request, pk):
        role = get_object_or_404(Roles, pk=pk)
        serializer = RoleSerializer(role, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Cập nhật role thành công."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Xóa Role
class RoleDeleteView(APIView):
    def delete(self, request, pk):
        role = get_object_or_404(Roles, pk=pk)
        role.delete()
        return Response({"message": "Xóa role thành công."}, status=status.HTTP_204_NO_CONTENT)