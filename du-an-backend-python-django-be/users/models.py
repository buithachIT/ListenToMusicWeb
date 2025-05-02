from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

from roles.models import Roles
from django.utils import timezone

class Users(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    user_name = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    fullname = models.CharField(max_length=255, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    role = models.ForeignKey(Roles, models.DO_NOTHING, blank=True, null=True)
    accesstoken = models.TextField(blank=True, null=True)
    refreshtoken = models.TextField(blank=True, null=True)
    email = models.CharField(unique=True, max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    image_user = models.TextField(blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(default=timezone.now, blank=True, null=True)
    url_avatar = models.CharField(unique=True, max_length=255,null=True)
    USERNAME_FIELD = 'user_name'
    REQUIRED_FIELDS = ['email'] 

    def get_username(self):
        return self.user_name

    def __str__(self):
        return self.user_name

    class Meta:
        managed = False
        db_table = 'users'
