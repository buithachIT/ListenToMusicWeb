from rest_framework import serializers
from .models import Playlists_Detail

class PlaylistDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlists_Detail
        fields = '__all__'
