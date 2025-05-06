from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PlaylistSerializer
from albums.models import Albums,Artists
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from .models import Playlists
from playlist_detail.models import Playlists_Detail
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from tracks.models import Tracks

class CreatePlaylistView(APIView):
    def post(self, request):
        serializer = PlaylistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Tao Album thành công!", "data": serializer.data,"status": status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED)
        return Response({"message": serializer.errors, "status": status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
class ListPlaylistView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get('user_id')  # lấy user_id trên URL

        if user_id is None:
            return Response({
                "message": "Thiếu user_id!",
                "status": status.HTTP_400_BAD_REQUEST
            }, status=status.HTTP_400_BAD_REQUEST)

        playlists = Playlists.objects.filter(user_id=user_id)
        serializer = PlaylistSerializer(playlists, many=True)
        
        return Response({
            "message": "Lấy danh sách playlist thành công!",
            "data": serializer.data,
            "status": status.HTTP_200_OK
        }, status=status.HTTP_200_OK)
@api_view(['GET'])
def get_tracks_from_playlist(request, playlist_id):
    playlist = get_object_or_404(Playlists, pk=playlist_id)
    track_details = Playlists_Detail.objects.filter(playlist_id=playlist)
    tracks = [detail.track_id for detail in track_details]

    # Build dữ liệu theo từng track
    data = []
    for track in tracks:
        data.append({
            "track_id": track.track_id,
            "title": track.title,
            "artist": track.artist.name if track.artist else None,
            "price": float(track.price) if track.price else None,
            "image_url": track.image_url,
            "release_date": track.release_date,
            "namemp3": track.namemp3,
            "listen": track.listen,
            "mv_url": track.mv_url,
        })

    # Bọc trong đối tượng JSON với key 'data'
    return JsonResponse({"data": data})