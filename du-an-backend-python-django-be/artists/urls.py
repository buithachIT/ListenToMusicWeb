# users/urls.py
from django.urls import path, include
from .views import *
urlpatterns = [
    path('create/', CreateArtistView.as_view(), name='register'),
]
