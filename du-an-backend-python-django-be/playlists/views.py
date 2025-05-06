from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PlaylistSerializer
from albums.models import Albums,Artists
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from playlists.models import Playlists

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
