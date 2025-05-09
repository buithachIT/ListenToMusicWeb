# Generated by Django 5.1.7 on 2025-04-15 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Playlists',
            fields=[
                ('playlist_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('ispublic', models.IntegerField(blank=True, null=True)),
                ('track', models.IntegerField(blank=True, null=True)),
                ('releasedate', models.DateField(blank=True, null=True)),
            ],
            options={
                'db_table': 'playlists',
                'managed': False,
            },
        ),
    ]
