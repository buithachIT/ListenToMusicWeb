from django.urls import path
from .views import *

urlpatterns = [
    path('create/', CreateRoleView.as_view(), name='create-role'),
    path('list/', RoleListView.as_view(), name='role-list'),                  # GET: lấy danh sách role
    path('<int:pk>/update/', RoleUpdateView.as_view(), name='role-update'),  # PUT: sửa role
    path('<int:pk>/delete/', RoleDeleteView.as_view(), name='role-delete'),  # DELETE: xóa role
]
