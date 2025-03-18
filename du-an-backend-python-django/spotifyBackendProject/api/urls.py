from django.urls import path
from .views import MessageListCreate

urlpatterns = [
    path('messages/', MessageListCreate.as_view(), name='message-list'),
]