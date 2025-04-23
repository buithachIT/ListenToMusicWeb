from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PlaylistDetailSerializer

class AddTrackToPlaylistView(APIView):
    def post(self, request):
        serializer = PlaylistDetailSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Thêm bài hát vào playlist thành công!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
