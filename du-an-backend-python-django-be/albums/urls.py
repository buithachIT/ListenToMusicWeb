# users/urls.py
from django.urls import path, include
from .views import *
urlpatterns = [
    path('create/', CreateAlbumView.as_view(), name='create-albums'),
    path('delete/<int:album_id>/', DeleteAlbumView.as_view(), name='delete-album'),
    path('getbyartist/<int:artist_id>/', GetAlbumbyAritstView, name='albums-by-artist'),
]
