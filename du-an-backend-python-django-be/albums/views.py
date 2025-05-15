from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Create your views here.
# Sự kiện thêm mới album
from .models import Albums
from .serializers import AlbumSerializer
from tracks.models import Tracks

class CreateAlbumView(APIView):
    def post(self, request):
        serializer = AlbumSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Thêm album thành công!",
                "data": serializer.data,
                "status": status.HTTP_201_CREATED
            }, status=status.HTTP_201_CREATED)
        return Response({ 
            "message": serializer.errors,
            "status": status.HTTP_400_BAD_REQUEST
        }, status=status.HTTP_400_BAD_REQUEST)
class DeleteAlbumView(APIView):
    def delete(self, request, album_id):
        try:
            album = Albums.objects.get(pk=album_id)  
            title = album.title    
            album.delete()
            return Response({"message": f"Xóa album {title} thành công!"}, status=status.HTTP_200_OK)
        except Tracks.DoesNotExist:
            return Response({"message": f"Bài hát với id={album_id} không tồn tại."},
                            status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def GetAlbumbyAritstView(request, artist_id):
    albums = Albums.objects.filter(artist_id=artist_id)
    serializer = AlbumSerializer(albums, many=True)
    return Response(serializer.data)
