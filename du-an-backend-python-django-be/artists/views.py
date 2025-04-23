from django.shortcuts import render
# Sự kiện thêm mới Artist ( Nghệ sĩ )
from .serializers import ArtistSerializer
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Artists
from tracks.models import Tracks
class CreateArtistView(APIView):
    def post(self, request):
        serializer = ArtistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Thêm nghệ sĩ thành công!",
                "data": serializer.data,
                "status": status.HTTP_201_CREATED
            }, status=status.HTTP_201_CREATED)
        return Response({
            "message": serializer.errors,
            "status": status.HTTP_400_BAD_REQUEST
        }, status=status.HTTP_400_BAD_REQUEST)
class DeleteArtistView(APIView):
    def delete(self, request, artist_id):
        try:
            artists = Artists.objects.get(pk=artist_id)  
            title = artists.name    
            artists.delete()
            return Response({"message": f"Xóa nghệ sĩ {title} thành công!"}, status=status.HTTP_200_OK)
        except Tracks.DoesNotExist:
            return Response({"message": f"Bài hát với id={artist_id} không tồn tại."},
                            status=status.HTTP_404_NOT_FOUND)
# Xem danh sách tất cả Role
class ArtistListView(APIView):
    def get(self, request):
        roles = Artists.objects.all()
        serializer = ArtistSerializer(roles, many=True)
        return Response({
                "message": "HEHE!",
                "data": serializer.data,
                "status": status.HTTP_201_CREATED
            }, status=status.HTTP_201_CREATED)
# Sửa thông tin Role
from django.shortcuts import get_object_or_404
class ArtistUpdateView(APIView):
    def put(self, request, pk):
        role = get_object_or_404(Artists, pk=pk)
        serializer = ArtistSerializer(role, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Cập nhật role thành công."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
