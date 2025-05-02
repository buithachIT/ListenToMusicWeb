from django.urls import path
from .views import *

urlpatterns = [
    path('mess/', chat_view, name='chatbox_api'),
]
