# users/urls.py
from django.urls import path, include
from .views import *
urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),#Post
    path('login/', LoginView.as_view(), name='user-login'),#Post
    path('<int:pk>/update/', UpdateUserView.as_view(), name='user-update'),#put
    path('<int:pk>/delete/', DeleteUserView.as_view(), name='user-delete'),#delete
]
#user/1/update