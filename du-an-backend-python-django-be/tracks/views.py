from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
from django.core.files.storage import default_storage
from .serializers import TrackSerializer
from .models import Tracks
from albums.models import Albums,Artists
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny 
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
import uuid


from django.core.files.storage import default_storage
import uuid

class CreateTrackView(APIView):
    def post(self, request):
        data = request.data.dict()  # ✅ Không dùng .copy()
        image_file = request.FILES.get('image')
        mp3_file = request.FILES.get('mp3')
        mv_file = request.FILES.get('mv')
        mp3_name = request.data.get('namemp3')
 # Đảm bảo thư mục public tồn tại trước khi lưu file
        public_folder = os.path.join(settings.MEDIA_ROOT, 'public')
        if not os.path.exists(public_folder):
            os.makedirs(public_folder)
        # Lưu từng file nếu có
        if image_file:
            image_name = f"{uuid.uuid4().hex}_{image_file.name}"
            image_path = default_storage.save(f'image_thumb/{image_name}', image_file)
            data['image_url'] = f"/media/imagethumb/{image_name}"

        if mp3_file:
            mp3_name = mp3_name or f"{uuid.uuid4().hex}_{mp3_file.name}"
            mp3_path = default_storage.save(f'music_file/{mp3_name}', mp3_file)
            data['namemp3'] = str(mp3_name)

        if mv_file:
            mv_name = f"{uuid.uuid4().hex}_{mv_file.name}"
            mv_path = default_storage.save(f'mv_file/{mv_name}', mv_file)
            data['mv_url'] = f"/media/mv_file/{mv_name}"
        else:
            data['mv_url'] = None

        # Sau khi đã xử lý file, mới truyền vào serializer
        serializer = TrackSerializer(data=data)
        if serializer.is_valid():
            track = serializer.save()
            return Response({
                "message": "Thêm bài hát thành công!",
                "data": TrackSerializer(track).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "message": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)


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
        tracks = Tracks.objects.all().order_by('-listen')[:8]
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