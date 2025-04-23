#Thêm ablum mới 
from rest_framework import serializers
from .models import Users, Playlists

class PlaylistSerializer(serializers.ModelSerializer):
    playlist_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    user_id = serializers.PrimaryKeyRelatedField(
        source='user',  # Trỏ đến trường 'user' trong model
        queryset=Playlists._meta.get_field('user').related_model.objects.all()
    )

    class Meta:
        model = Playlists
        fields = ['playlist_id', 'user_id', 'name', 'ispublic', 'releasedate']

    def create(self, validated_data):
        playlist_id = validated_data.pop('playlist_id', None)
        if playlist_id:
            try:
                playlists = Playlists.objects.get(pk=playlist_id)
                validated_data['playlists'] = playlists
            except Playlists.DoesNotExist:
                raise serializers.ValidationError(f"Playlist khong ton tai với id={playlist_id} không tồn tại.")
        return Playlists.objects.create(**validated_data)
   