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
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        try:
            data = request.data.dict()
            print("Received data:", data)  # Add logging
            print("Received files:", request.FILES)  # Add logging
            
            mp3_file = request.FILES.get('mp3')
            
            if not mp3_file:
                return Response({
                    "message": "MP3 file is required"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Ensure required directories exist
            music_folder = os.path.join(settings.MEDIA_ROOT, 'music_file')
            if not os.path.exists(music_folder):
                os.makedirs(music_folder)

            # Save MP3 file
            mp3_name = data.get('namemp3') or f"{uuid.uuid4().hex}_{mp3_file.name}"
            mp3_path = default_storage.save(f'music_file/{mp3_name}', mp3_file)
            data['namemp3'] = mp3_name

            # Validate data
            serializer = TrackSerializer(data=data)
            if serializer.is_valid():
                track = serializer.save()
                return Response({
                    "message": "Track created successfully",
                    "data": TrackSerializer(track).data
                }, status=status.HTTP_201_CREATED)
            print("Serializer errors:", serializer.errors)  # Add logging
            return Response({
                "message": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            print("Exception:", str(e))  # Add logging
            return Response({
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

class UpdateTrackView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    def put(self, request, track_id):
        try:
            track = Tracks.objects.get(pk=track_id)
            data = request.data.dict()
            mp3_file = request.FILES.get('mp3')
            mv_file = request.FILES.get('mv')

            # Handle MP3 file if provided
            if mp3_file:
                # Ensure required directories exist
                music_folder = os.path.join(settings.MEDIA_ROOT, 'music_file')
                if not os.path.exists(music_folder):
                    os.makedirs(music_folder)

                # Save new MP3 file
                mp3_name = data.get('namemp3') or f"{uuid.uuid4().hex}_{mp3_file.name}"
                mp3_path = default_storage.save(f'music_file/{mp3_name}', mp3_file)
                data['namemp3'] = mp3_name

            # Handle MV file if provided
            if mv_file:
                # Ensure required directories exist
                mv_folder = os.path.join(settings.MEDIA_ROOT, 'mv_file')
                if not os.path.exists(mv_folder):
                    os.makedirs(mv_folder)

                # Save new MV file
                mv_name = f"{uuid.uuid4().hex}_{mv_file.name}"
                mv_path = default_storage.save(f'mv_file/{mv_name}', mv_file)
                data['mv_url'] = f'{mv_name}'

            # Handle album changes
            old_album = track.album
            new_album_id = data.get('album_id')
            
            if old_album and old_album.id != new_album_id:
                # Decrease total_tracks of old album
                if old_album.total_tracks is not None and old_album.total_tracks > 0:
                    old_album.total_tracks -= 1
                    old_album.save()

            # Validate and save data
            serializer = TrackSerializer(track, data=data, partial=True)
            if serializer.is_valid():
                updated_track = serializer.save()
                return Response({
                    "message": "Track updated successfully",
                    "data": TrackSerializer(updated_track).data
                }, status=status.HTTP_200_OK)
            return Response({
                "message": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Tracks.DoesNotExist:
            return Response({
                "message": f"Track with id={track_id} does not exist."
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)