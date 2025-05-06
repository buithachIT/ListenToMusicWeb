from django.db import models
from users.models import Users
from tracks.models import Tracks
class Playlists(models.Model):
    playlist_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('users.Users', models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(max_length=255)
    ispublic = models.IntegerField(blank=True, null=True)
    releasedate = models.DateField(blank=True, null=True)
    tracks = models.ManyToManyField(Tracks, related_name='playlists')
    class Meta:
        managed = False
        db_table = 'playlists'
