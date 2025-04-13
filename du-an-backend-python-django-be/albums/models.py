from django.db import models
from artists.models import Artists

class Albums(models.Model):
    album_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    deception = models.TextField(blank=True, null=True)
    artist = models.ForeignKey('artists.Artists', models.DO_NOTHING, blank=True, null=True)
    total_tracks = models.IntegerField(blank=True, null=True)
    releasedate = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'albums'