#Thêm Artist ( Nghệ sĩ )
from rest_framework import serializers
from .models import Artists

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artists
        fields = ['artist_id', 'name', 'popularity_score', 'gener', 'follower']
