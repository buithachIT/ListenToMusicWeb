from django.urls import path
from .views import *

urlpatterns = [
    path('addtracktoplaylist/', AddTrackToPlaylistView.as_view(), name='addtracktoplaylist'),
   
]
