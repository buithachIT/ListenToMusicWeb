from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Message
from .serializers import MessageSerializer

class MessageListCreate(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer