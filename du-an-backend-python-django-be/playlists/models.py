from django.db import models
<<<<<<< HEAD

# Create your models here.
=======
from users.models import Users
class Playlists(models.Model):
    playlist_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('users.Users', models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(max_length=255)
    ispublic = models.IntegerField(blank=True, null=True)
    track = models.IntegerField(blank=True, null=True)
    releasedate = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'playlists'
>>>>>>> bcd161744d1fcd440b67199d4c12899411df4d0d
