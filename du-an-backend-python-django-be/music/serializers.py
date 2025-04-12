from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Users, Roles
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
class UserSerializer(serializers.ModelSerializer):
    # Thêm trường role_id, nếu không được cung cấp sẽ mặc định là 2
    role_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Users
        fields = ['user_name', 'passwordhash', 'fullname', 'birthday', 'email', 'phone', 'image_user', 'role_id']
        extra_kwargs = {
            'passwordhash': {'write_only': True}
        }
    
    def create(self, validated_data):
        # Lấy role_id nếu có, ngược lại mặc định là 2
        role_id = validated_data.pop('role_id', 2)
        # Mã hóa mật khẩu trước khi lưu
        validated_data['passwordhash'] = make_password(validated_data['passwordhash'])
        # Lấy instance của Roles dựa trên role_id
        try:
            role_instance = Roles.objects.get(pk=role_id)
        except Roles.DoesNotExist:
            raise serializers.ValidationError(f"Role với role_id={role_id} không tồn tại.")
        validated_data['role'] = role_instance
        return super(UserSerializer, self).create(validated_data)
class LoginSerializer(serializers.Serializer):
    user_name = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user_name = data.get('user_name')
        password = data.get('password')

        try:
            user = Users.objects.get(user_name=user_name)
        except Users.DoesNotExist:
            raise serializers.ValidationError("Người dùng không tồn tại.")

        if not check_password(password, user.passwordhash):
            raise serializers.ValidationError("Mật khẩu không đúng.")

        data['user'] = user
        return data
# Lấy token khi đăng nhập                                     
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    user_name = serializers.CharField()

    def validate(self, attrs):
        # Lấy giá trị của user_name và password từ dữ liệu đầu vào
        user_name = attrs.get('user_name')
        password = attrs.get('password')

        # Xác thực người dùng
        user = authenticate(request=self.context.get('request'), user_name=user_name, password=password)

        if not user:
            raise serializers.ValidationError('Không thể xác thực với thông tin đăng nhập được cung cấp.')

        if not user.is_active:
            raise serializers.ValidationError('Tài khoản này không hoạt động.')

        # Gọi phương thức validate của lớp cha để lấy token
        data = super().validate(attrs)
        return data
    
#Thêm Artist ( Nghệ sĩ )
from rest_framework import serializers
from .models import Artists

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artists
        fields = ['artist_id', 'name', 'popularity_score', 'gener', 'follower']

#Thêm ablum mới 
from .models import Albums, Artists

class AlbumSerializer(serializers.ModelSerializer):
    artist_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Albums
        fields = ['album_id', 'title', 'deception', 'artist_id', 'total_tracks', 'releasedate']

    def create(self, validated_data):
        artist_id = validated_data.pop('artist_id', None)
        if artist_id:
            try:
                artist = Artists.objects.get(pk=artist_id)
                validated_data['artist'] = artist
            except Artists.DoesNotExist:
                raise serializers.ValidationError(f"Nghệ sĩ với id={artist_id} không tồn tại.")
        return Albums.objects.create(**validated_data)
   
#Thêm bài hát 
from rest_framework import serializers
from .models import Tracks, Albums, Artists

class TrackSerializer(serializers.ModelSerializer):
    album_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    artist_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Tracks
        fields = [
            'track_id', 'title', 'album_id', 'artist_id', 'is_copyright',
            'price', 'image_url', 'release_date','namemp3'
        ]

    def create(self, validated_data):
        album_id = validated_data.pop('album_id', None)
        artist_id = validated_data.pop('artist_id', None)

        if album_id:
            try:
                album = Albums.objects.get(pk=album_id)
                validated_data['album'] = album
                # Tăng total_tracks của album lên 1
                if album.total_tracks is None:
                    album.total_tracks = 1
                else:
                    album.total_tracks += 1
                album.save()
            except Albums.DoesNotExist:
                raise serializers.ValidationError(f"Album với id={album_id} không tồn tại.")

        if artist_id:
            try:
                artist = Artists.objects.get(pk=artist_id)
                validated_data['artist'] = artist
            except Artists.DoesNotExist:
                raise serializers.ValidationError(f"Artist với id={artist_id} không tồn tại.")

        return Tracks.objects.create(**validated_data)
