from django.shortcuts import render
# Sự kiện thêm mới Artist ( Nghệ sĩ )
from .serializers import ArtistSerializer
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView

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