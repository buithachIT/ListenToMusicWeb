# users/urls.py
from django.urls import path, include
from .views import *
urlpatterns = [
    path('create/', CreateArtistView.as_view(), name='register'),
    path('delete/<int:artist_id>/', DeleteArtistView.as_view(), name='delete-artist'),
    path('list/', ArtistListView.as_view(), name='artist-list'),                  # GET: lấy danh sách 
    path('update/<int:pk>/', ArtistUpdateView.as_view(), name='artist-update'),
]
