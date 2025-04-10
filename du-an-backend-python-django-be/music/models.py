# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import AbstractUser


class Albums(models.Model):
    album_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    deception = models.TextField(blank=True, null=True)
    artist = models.ForeignKey('Artists', models.DO_NOTHING, blank=True, null=True)
    total_tracks = models.IntegerField(blank=True, null=True)
    releasedate = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'albums'


class Artists(models.Model):
    artist_id = models.AutoField(primary_key=True)
    popularity_score = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=255)
    gener = models.CharField(max_length=255, blank=True, null=True)
    follower = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'artists'


class PlaylistOder(models.Model):
    playlist_oder_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    track = models.ForeignKey('Tracks', models.DO_NOTHING, blank=True, null=True)
    datte_oder = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'playlist_oder'


class Playlists(models.Model):
    playlist_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(max_length=255)
    ispublic = models.IntegerField(blank=True, null=True)
    track = models.IntegerField(blank=True, null=True)
    releasedate = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'playlists'


class PlaylistsDetail(models.Model):
    playlist = models.OneToOneField(Playlists, models.DO_NOTHING, primary_key=True)  # The composite primary key (playlist_id, track_id) found, that is not supported. The first column is selected.
    track = models.ForeignKey('Tracks', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'playlists_detail'
        unique_together = (('playlist', 'track'),)


class Roles(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=255)
    deception = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roles'


class Tracks(models.Model):
    track_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    album = models.ForeignKey(Albums, models.DO_NOTHING, blank=True, null=True)
    artist = models.ForeignKey(Artists, models.DO_NOTHING, blank=True, null=True)
    is_copyright = models.IntegerField(db_column='is_Copyright', blank=True, null=True)  # Field name made lowercase.
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)
    release_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tracks'


class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    user_name = models.CharField(unique=True, max_length=255)
    passwordhash = models.CharField(max_length=255)
    fullname = models.CharField(max_length=255, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    role = models.ForeignKey(Roles, models.DO_NOTHING, blank=True, null=True)
    accesstoken = models.TextField(blank=True, null=True)
    refreshtoken = models.TextField(blank=True, null=True)
    email = models.CharField(unique=True, max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    image_user = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        managed = False
        db_table = 'users'
