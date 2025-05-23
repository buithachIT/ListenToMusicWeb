# Generated by Django 5.1.7 on 2025-04-15 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Albums',
            fields=[
                ('album_id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('deception', models.TextField(blank=True, null=True)),
                ('total_tracks', models.IntegerField(blank=True, null=True)),
                ('releasedate', models.DateField(blank=True, null=True)),
            ],
            options={
                'db_table': 'albums',
                'managed': False,
            },
        ),
    ]
