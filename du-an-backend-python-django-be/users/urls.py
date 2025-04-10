# users/urls.py
from django.urls import path, include
from .views import *
urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('<int:pk>/update/', UpdateUserView.as_view(), name='user-update'),
    path('<int:pk>/delete/', DeleteUserView.as_view(), name='user-delete'),
    path('list/', ListUsersView.as_view(), name='list-users'),
]
