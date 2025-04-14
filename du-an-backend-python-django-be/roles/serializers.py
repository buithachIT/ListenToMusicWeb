from rest_framework import serializers
from .models import Roles

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = ['role_id', 'role_name', 'deception']
        read_only_fields = ['role_id']  # AutoField nên không cần truyền từ client
