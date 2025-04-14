from django.db import models

# Create your models here.
class Roles(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=255)
    deception = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roles'
