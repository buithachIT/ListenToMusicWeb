from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import TrackSerializer
from .models import Tracks
from albums.models import Albums,Artists
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny 

class CreateTrackView(APIView):
    def post(self, request):
        serializer = TrackSerializer(data=request.data)
        if serializer.is_valid():
            track = serializer.save()
            response_serializer = TrackSerializer(track)

            return Response({"message": "Thêm bài hát thành công!", "data": response_serializer.data,"status": status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED)
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

#Lấy ra danh sách người dùng   
class ListTrackView(APIView):
    permission_classes = [AllowAny] 
    def get(self, request):
        tracks = Tracks.objects.all()
        serializer = TrackSerializer(tracks, many=True)
        return Response({"data": serializer.data, "message": "Lấy danh sách bài hát thành công!"}, status=status.HTTP_200_OK)

class ListTrackTopView(APIView):
    permission_classes = [AllowAny] 
    def get(self, request):
        tracks = Tracks.objects.all().order_by('-listen')  # <-- Sắp xếp giảm dần theo listen
        serializer = TrackSerializer(tracks, many=True)
        return Response({
            "data": serializer.data,
            "message": "Lấy danh sách bài hát thành công!"
        }, status=status.HTTP_200_OK)
    
class Top10TrackView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        tracks = Tracks.objects.all().order_by('-listen')[:10]
        serializer = TrackSerializer(tracks, many=True)
        return Response({
            "data": serializer.data,
            "message": "Lấy top 10 bài hát có lượt nghe cao nhất thành công!"
        }, status=status.HTTP_200_OK)
    
class TracksByArtistView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, artist_id):
        tracks = Tracks.objects.filter(artist_id=artist_id).order_by('-listen')
        serializer = TrackSerializer(tracks, many=True)
        return Response({
            "data": serializer.data,
            "message": f"Lấy danh sách bài hát theo artist_id={artist_id} thành công!"
        }, status=status.HTTP_200_OK)
@api_view(['GET'])
def search_track(request):
    query = request.GET.get('q','').strip().lower()
    if query:
        tracks = Tracks.objects.filter(title__icontains=query)
    else:
        tracks = Tracks.objects.none()

    serializer = TrackSerializer(tracks, many = True)
    return Response(serializer.data)

@api_view(['GET'])
def search_by_artist(request):
    query = request.GET.get('q', '').strip()
    if not query:
        return Response({"error": "Missing query parameter 'q'"}, status=400)

    tracks = Tracks.objects.filter(artist__name__icontains=query)
    serializer = TrackSerializer(tracks, many=True)
    return Response(serializer.data)