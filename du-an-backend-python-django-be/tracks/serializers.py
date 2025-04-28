#Thêm bài hát 
from rest_framework import serializers
from .models import Tracks, Albums, Artists
from artists.serializers import ArtistSerializer
class TrackSerializer(serializers.ModelSerializer):
    album_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    artist_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    artist = ArtistSerializer(read_only=True)

    class Meta:
        model = Tracks
        fields = [
            'track_id', 'title', 'album_id', 'artist_id','artist', 'is_copyright',
            'price', 'image_url', 'release_date','namemp3','listen','mv_url'
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