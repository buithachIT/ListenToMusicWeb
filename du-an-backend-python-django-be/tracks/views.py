from django.shortcuts import render
<<<<<<< HEAD

# Create your views here.
=======
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TrackSerializer
from .models import Tracks
from albums.models import Albums,Artists
from rest_framework.decorators import api_view

class CreateTrackView(APIView):
    def post(self, request):
        serializer = TrackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Thêm bài hát thành công!", "data": serializer.data,"status": status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED)
        return Response({"message": serializer.errors, "status": status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

class DeleteTrackView(APIView):
    def delete(self, request, track_id):
        try:
            track = Tracks.objects.get(pk=track_id)

            # Nếu track thuộc album nào đó, giảm total_tracks
            if track.album:
                album = track.album
                if album.total_tracks is not None and album.total_tracks > 0:
                    album.total_tracks -= 1
                    album.save()

            # Xóa bài hát
            track.delete()

            return Response({"message": "Xóa bài hát thành công!"}, status=status.HTTP_200_OK)

        except Tracks.DoesNotExist:
            return Response({"message": f"Bài hát với id={track_id} không tồn tại."},
                            status=status.HTTP_404_NOT_FOUND)
@api_view(['GET'])
def GetTrackbyAlbums(request, album_id):
    track = Tracks.objects.filter(album_id=album_id)
    serializer = TrackSerializer(track, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def GetTrackbyArtist(request, artist_id):
    track = Tracks.objects.filter(artist_id=artist_id)
    serializer = TrackSerializer(track, many=True)
    return Response(serializer.data)
>>>>>>> bcd161744d1fcd440b67199d4c12899411df4d0d
