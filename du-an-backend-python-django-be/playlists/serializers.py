from rest_framework import serializers
from playlists.models import Playlists, Tracks

class PlaylistSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        source='user',
        queryset=Playlists._meta.get_field('user').related_model.objects.all()
    )

    class Meta:
        model = Playlists
        fields = ['playlist_id', 'user_id', 'name', 'ispublic', 'releasedate']
        read_only_fields = ['playlist_id']

    def create(self, validated_data):
        return Playlists.objects.create(**validated_data)
class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tracks
        fields = '__all__'