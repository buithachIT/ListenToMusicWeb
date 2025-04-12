from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
# Sự kiện đăng ký người dùng
class RegisterUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Đăng ký thành công!", "status":status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED)
        return Response({"message": serializer.errors, "status" :status.HTTP_400_BAD_REQUEST})
    
# Sự kiện đăng nhập người dùng    
from .serializers import LoginSerializer
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response({
                "data":{
                "user_id": user.user_id,
                "user_name": user.user_name,
                "email": user.email,
                },
                "message": {
                    "Đăng nhập thành công!"
                }
                # Thêm các thông tin khác nếu cần
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Sự kiện thêm mới Artist ( Nghệ sĩ )
from .serializers import ArtistSerializer

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

# Sự kiện thêm mới album
from .serializers import AlbumSerializer

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
    
# Sự kiện thêm mới bài hát
from .serializers import TrackSerializer

class CreateTrackView(APIView):
    def post(self, request):
        serializer = TrackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Thêm bài hát thành công!", "data": serializer.data,"status": status.HTTP_201_CREATED}, status=status.HTTP_201_CREATED)
        return Response({"message": serializer.errors, "status": status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

# Sự kiện xóa bài hát 
from .models import Tracks, Albums

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
