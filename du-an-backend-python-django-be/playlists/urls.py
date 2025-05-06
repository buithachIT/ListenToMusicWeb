from django.urls import path, include
from .views import *

urlpatterns = [
    path('create/', CreatePlaylistView.as_view(), name='create-playlist'),
    path('list-playlist/', ListPlaylistView.as_view(), name='list-playlist'),
    path('playlists/<int:pk>/tracks/', PlaylistTracksView.as_view(), name='playlist-tracks'),
]