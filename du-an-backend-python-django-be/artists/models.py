from django.db import models

# Create your models here.
class Artists(models.Model):
    artist_id = models.AutoField(primary_key=True)
    popularity_score = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=255)
    gener = models.CharField(max_length=255, blank=True, null=True)
    follower = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'artists'
