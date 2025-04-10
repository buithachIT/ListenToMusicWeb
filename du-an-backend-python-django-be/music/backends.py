from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class CustomUserBackend(ModelBackend):
    def authenticate(self, request, user_name=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(user_name=user_name)
        except UserModel.DoesNotExist:
            return None
        if user.check_password(password):
            return user
        return None
