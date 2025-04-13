#Thêm ablum mới 
from rest_framework import serializers
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
   