# users/urls.py
from django.urls import path, include
from .views import *
urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),#push
    path('login/', LoginView.as_view(), name='user-login'),
    path('refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('<int:pk>/update/', UpdateUserView.as_view(), name='user-update'),
    path('<int:pk>/delete/', DeleteUserView.as_view(), name='user-delete'),
    path('list/', ListUsersView.as_view(), name='list-users'),
    path('getuserbyid/<int:user_id>/', GetUserbyIdView, name='usersbyid'),
    path('token/<str:accesstoken>/', GetUserbyTokenView, name='usersbyToken'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
