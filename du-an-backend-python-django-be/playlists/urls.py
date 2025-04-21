from django.urls import path, include
from .views import *

urlpatterns = [
    path('create/', CreatePlaylistView.as_view(), name='create-playlist'),
]