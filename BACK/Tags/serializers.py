from rest_framework import serializers
from django.db.models.functions import Least, Greatest
from django.db.models import UniqueConstraint
from Tags.models import Tag

class TagSerializer(serializers.ModelSerializer):

    class Meta:
        unique_together = ('categoria', 'user')
        model = Tag
        fields = (
            'id',
            'categoria',
            'cor',
            'user'        
        )
        #BUG: constraints não funcionam, dívida tecnica
        constraints = [
            UniqueConstraint(
                Least('categoria', 'user_id'),
                Greatest('user_id', 'categoria'),
                name='antisymmetric',
            ),
        UniqueConstraint(fields=['categoria', 'user'], name="categ_per_user")
        ]