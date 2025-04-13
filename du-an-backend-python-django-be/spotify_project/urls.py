"""
URL configuration for spotify_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from music.views import *
from users.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('roles/', include('roles.urls')),
    path('artists/', include('artists.urls')), 
    path('albums/', include('albums.urls')), 
    path('tracks/', include('tracks.urls')), 

    
    path('addtrack/',CreateTrackView.as_view(),name='track'),
    path('addartist/', CreateArtistView.as_view(), name='artist'),
    path('addablum/',CreateAlbumView.as_view(),name='ablum'),
    path('deletetrack/<int:track_id>/', DeleteTrackView.as_view(), name='delete-track'),
    path('deletealbum/<int:album_id>/', DeleteAlbumView.as_view(), name='delete-album'),
 
]
                                                                            