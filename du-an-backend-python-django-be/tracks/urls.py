# users/urls.py
from django.urls import path, include
from .views import *
urlpatterns = [
    path('create/', CreateTrackView.as_view(), name='register'),
    path('delete/<int:track_id>/', DeleteTrackView.as_view(), name='delete-track'),
    path('getbyalbum/<int:album_id>/', GetTrackbyAlbums, name='tracks-by-albums'),
    path('getbyartist/<int:artist_id>/', GetTrackbyArtist, name='tracks-by-artist'),
]
